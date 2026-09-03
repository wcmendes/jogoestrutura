// Camada de ranking: usa Supabase quando disponível, senão cai pro localStorage.
// Também assina o Realtime para atualizar o ranking ao vivo.

const Ranking = (() => {
  const CHAVE_LOCAL = "ranking_estruturas";
  let cliente = null;
  let usandoSupabase = false;
  let ouvintes = [];

  // Inicializa o cliente Supabase se o SDK e a config existirem e forem válidos.
  function init() {
    try {
      const temSDK = typeof window.supabase !== "undefined";
      const temConfig =
        typeof SUPABASE_URL === "string" &&
        typeof SUPABASE_ANON_KEY === "string" &&
        SUPABASE_URL.startsWith("http") &&
        SUPABASE_ANON_KEY.length > 20;

      if (temSDK && temConfig) {
        cliente = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        usandoSupabase = true;
      }
    } catch (e) {
      console.warn("Supabase indisponível, usando ranking local.", e);
      usandoSupabase = false;
    }
  }

  // ---------- localStorage helpers ----------
  function lerLocal() {
    try {
      return JSON.parse(localStorage.getItem(CHAVE_LOCAL)) || [];
    } catch {
      return [];
    }
  }

  function salvarLocal(lista) {
    localStorage.setItem(CHAVE_LOCAL, JSON.stringify(lista));
  }

  // ---------- API pública ----------

  // Salva um resultado. Retorna o objeto salvo.
  async function salvar(resultado) {
    const registro = {
      nome: resultado.nome,
      pontos: resultado.pontos,
      acertos: resultado.acertos,
      erros: resultado.erros
    };

    if (usandoSupabase) {
      try {
        const { error } = await cliente.from("ranking").insert(registro);
        if (error) throw error;
        return registro;
      } catch (e) {
        console.warn("Falha ao salvar no Supabase, salvando local.", e);
      }
    }

    const lista = lerLocal();
    lista.push({ ...registro, criado_em: new Date().toISOString() });
    salvarLocal(lista);
    return registro;
  }

  // Busca o ranking ordenado (maior pontuação primeiro).
  async function listar(limite = 10) {
    if (usandoSupabase) {
      try {
        const { data, error } = await cliente
          .from("ranking")
          .select("nome, pontos, acertos, erros, criado_em")
          .order("pontos", { ascending: false })
          .order("criado_em", { ascending: true })
          .limit(limite);
        if (error) throw error;
        return data || [];
      } catch (e) {
        console.warn("Falha ao ler do Supabase, lendo local.", e);
      }
    }

    const lista = lerLocal().sort((a, b) => {
      if (b.pontos !== a.pontos) return b.pontos - a.pontos;
      return new Date(a.criado_em) - new Date(b.criado_em);
    });
    return lista.slice(0, limite);
  }

  // Assina mudanças em tempo real. callback é chamado quando alguém entra no ranking.
  function aoAtualizar(callback) {
    ouvintes.push(callback);

    if (usandoSupabase && ouvintes.length === 1) {
      cliente
        .channel("ranking-ao-vivo")
        .on(
          "postgres_changes",
          { event: "INSERT", schema: "public", table: "ranking" },
          () => ouvintes.forEach((cb) => cb())
        )
        .subscribe();
    }
  }

  // ---------- Feed de eventos ao vivo (acertos/erros durante o jogo) ----------

  // Registra um evento de resposta. Se o Supabase estiver off, não faz nada
  // (o feed ao vivo só faz sentido compartilhado).
  async function registrarEvento(evento) {
    if (!usandoSupabase) return;
    try {
      const { error } = await cliente.from("eventos").insert({
        nome: evento.nome,
        estrutura: evento.estrutura,
        acertou: evento.acertou
      });
      if (error) throw error;
    } catch (e) {
      console.warn("Falha ao registrar evento ao vivo.", e);
    }
  }

  // Monta o ranking AO VIVO a partir dos eventos (pontuação parcial em tempo real).
  // Cada acerto vale PONTOS_POR_ACERTO. Retorna [{nome, pontos, acertos, erros}] ordenado.
  async function rankingAoVivo(pontosPorAcerto = 10, limite = 10) {
    if (!usandoSupabase) return [];
    try {
      const { data, error } = await cliente
        .from("eventos")
        .select("nome, acertou")
        .order("criado_em", { ascending: true });
      if (error) throw error;

      const porJogador = {};
      (data || []).forEach((ev) => {
        if (!porJogador[ev.nome]) porJogador[ev.nome] = { nome: ev.nome, pontos: 0, acertos: 0, erros: 0 };
        if (ev.acertou) {
          porJogador[ev.nome].acertos++;
          porJogador[ev.nome].pontos += pontosPorAcerto;
        } else {
          porJogador[ev.nome].erros++;
        }
      });

      return Object.values(porJogador)
        .sort((a, b) => b.pontos - a.pontos || b.acertos - a.acertos)
        .slice(0, limite);
    } catch (e) {
      console.warn("Falha ao montar ranking ao vivo.", e);
      return [];
    }
  }

  // Assina o feed ao vivo. callback(evento) é chamado a cada nova resposta de qualquer jogador.
  function aoEvento(callback) {
    if (!usandoSupabase) return;
    cliente
      .channel("eventos-ao-vivo")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "eventos" },
        (payload) => callback(payload.new)
      )
      .subscribe();
  }

  // Apaga TODO o ranking e os eventos. Usado pela página /admin.
  async function limparTudo() {
    if (usandoSupabase) {
      // gt.0 num id sempre-positivo = todas as linhas
      const r1 = await cliente.from("eventos").delete().gt("id", 0);
      const r2 = await cliente.from("ranking").delete().gt("id", 0);
      if (r1.error) throw r1.error;
      if (r2.error) throw r2.error;
      return;
    }
    localStorage.removeItem(CHAVE_LOCAL);
  }

  function estaOnline() {
    return usandoSupabase;
  }

  init();

  return { salvar, listar, rankingAoVivo, aoAtualizar, registrarEvento, aoEvento, limparTudo, estaOnline };
})();
