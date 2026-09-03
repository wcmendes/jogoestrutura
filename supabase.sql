-- =============================================================
-- Configuração da tabela de ranking no Supabase
-- Rode este script no painel: SQL Editor -> New query -> Run
-- =============================================================

-- 1) Tabela de ranking
create table if not exists public.ranking (
  id         bigint generated always as identity primary key,
  nome       text not null check (char_length(nome) between 1 and 30),
  pontos     integer not null default 0 check (pontos >= 0),
  acertos    integer not null default 0 check (acertos >= 0),
  erros      integer not null default 0 check (erros >= 0),
  criado_em  timestamptz not null default now()
);

-- Índice para ordenar o ranking rápido (maior pontuação primeiro)
create index if not exists ranking_pontos_idx
  on public.ranking (pontos desc, criado_em asc);

-- 2) Habilita Row Level Security
alter table public.ranking enable row level security;

-- 3) Políticas de acesso
-- Qualquer visitante (anon) pode LER o ranking
drop policy if exists "ranking_leitura_publica" on public.ranking;
create policy "ranking_leitura_publica"
  on public.ranking
  for select
  to anon, authenticated
  using (true);

-- Qualquer visitante (anon) pode INSERIR o próprio resultado
drop policy if exists "ranking_insercao_publica" on public.ranking;
create policy "ranking_insercao_publica"
  on public.ranking
  for insert
  to anon, authenticated
  with check (
    char_length(nome) between 1 and 30
    and pontos >= 0
    and acertos >= 0
    and erros >= 0
  );

-- Obs: não criamos policies de UPDATE nem DELETE.
-- Sem elas, ninguém com a anon key pode editar ou apagar registros. Só inserir e ler.

-- 4) Habilita Realtime para a tabela (ranking ao vivo)
alter publication supabase_realtime add table public.ranking;

-- =============================================================
-- 5) Tabela de eventos ao vivo (feed de acertos/erros durante o jogo)
-- =============================================================
create table if not exists public.eventos (
  id         bigint generated always as identity primary key,
  nome       text not null check (char_length(nome) between 1 and 30),
  estrutura  text not null check (char_length(estrutura) between 1 and 30),
  acertou    boolean not null,
  criado_em  timestamptz not null default now()
);

-- Índice para buscar os eventos mais recentes
create index if not exists eventos_criado_idx
  on public.eventos (criado_em desc);

-- RLS
alter table public.eventos enable row level security;

-- Qualquer visitante pode LER os eventos
drop policy if exists "eventos_leitura_publica" on public.eventos;
create policy "eventos_leitura_publica"
  on public.eventos
  for select
  to anon, authenticated
  using (true);

-- Qualquer visitante pode INSERIR eventos (o próprio acerto/erro)
drop policy if exists "eventos_insercao_publica" on public.eventos;
create policy "eventos_insercao_publica"
  on public.eventos
  for insert
  to anon, authenticated
  with check (
    char_length(nome) between 1 and 30
    and char_length(estrutura) between 1 and 30
  );

-- Sem UPDATE/DELETE: ninguém com a anon key edita ou apaga eventos.

-- Habilita Realtime para o feed ao vivo
alter publication supabase_realtime add table public.eventos;

-- =============================================================
-- 6) Permissão de limpeza (usada pela página /admin)
-- ATENÇÃO: isto libera o DELETE para a anon key nas duas tabelas.
-- Como é um jogo de sala de aula, a proteção do botão é feita no
-- frontend (confirmação). Se quiser travar de verdade, remova estas
-- policies e limpe pelo painel com:
--   truncate public.ranking, public.eventos restart identity;
-- =============================================================
drop policy if exists "ranking_limpeza" on public.ranking;
create policy "ranking_limpeza"
  on public.ranking
  for delete
  to anon, authenticated
  using (true);

drop policy if exists "eventos_limpeza" on public.eventos;
create policy "eventos_limpeza"
  on public.eventos
  for delete
  to anon, authenticated
  using (true);
