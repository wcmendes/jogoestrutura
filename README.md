# 🎮 Desafio das Estruturas de Dados

Jogo educativo de perguntas e respostas sobre **Lista, Pilha, Fila, Vetor, Matriz e Registro**.
Os alunos digitam o nome, respondem os desafios e aparecem em um **ranking em tempo real**.

Feito apenas com **HTML, CSS e JavaScript** + **Supabase** para o ranking online.

## 🚀 Como colocar no ar

### 1. Configurar o banco (Supabase)

1. Acesse seu projeto no [Supabase](https://supabase.com).
2. Vá em **SQL Editor → New query**.
3. Cole todo o conteúdo do arquivo `supabase.sql` e clique em **Run**.

Isso cria a tabela `ranking`, as regras de segurança (RLS) e ativa o tempo real.

### 2. Publicar no GitHub Pages

1. Suba estes arquivos para um repositório no GitHub.
2. Vá em **Settings → Pages**.
3. Em **Source**, escolha a branch `main` e a pasta `/root`.
4. Salve. O link do jogo vai aparecer (algo como `https://SEU-USUARIO.github.io/SEU-REPO/`).
5. Compartilhe o link com a turma. 🎉

## 🗂️ Arquivos

| Arquivo         | Função                                              |
| --------------- | --------------------------------------------------- |
| `index.html`    | Estrutura das telas (início, jogo, resultado)       |
| `style.css`     | Aparência e responsividade                          |
| `perguntas.js`  | Banco de perguntas (edite/adicione aqui)            |
| `config.js`     | URL e chave pública do Supabase                     |
| `ranking.js`    | Salva/lê ranking (Supabase + tempo real)            |
| `jogo.js`       | Lógica do jogo                                      |
| `supabase.sql`  | Script para criar a tabela no Supabase              |

## ✏️ Adicionar perguntas

Edite `perguntas.js`. Cada pergunta segue este formato:

```js
{
  estrutura: "Pilha",
  enunciado: "Sua pergunta aqui?",
  opcoes: ["Opção A", "Opção B", "Opção C", "Opção D"],
  correta: 1, // índice da opção correta (começa em 0)
  explicacao: "Explicação que aparece após responder."
}
```

## 🔒 Segurança

- A `anon key` em `config.js` é **pública por natureza** e pode ficar no GitHub.
- A proteção real vem das **RLS policies**: alunos só podem **ler** o ranking e **inserir** o próprio resultado. Ninguém consegue editar ou apagar registros dos outros.
- A **senha do banco Postgres** nunca deve ser usada no frontend nem enviada ao GitHub.

## 💡 Sem Supabase?

Se o Supabase estiver indisponível ou não configurado, o jogo automaticamente usa o
`localStorage` do navegador — funciona offline, mas o ranking fica só naquele dispositivo.
