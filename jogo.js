// Lógica principal do jogo.

const PONTOS_POR_ACERTO = 10;

const estado = {
  nome: "",
  indice: 0,
  pontos: 0,
  acertos: 0,
  erros: 0,
  perguntas: [],
  respondida: false
};

// Elementos
const el = {
  telaInicio: document.getElementById("tela-inicio"),
  telaJogo: document.getElementById("tela-jogo"),
  telaFinal: document.getElementById("tela-final"),
  nomeInput: document.getElementById("nome-jogador"),
  btnIniciar: document.getElementById("btn-iniciar"),
  btnProxima: document.getElementById("btn-proxima"),
  btnNovamente: document.getElementById("btn-jogar-novamente"),
  hudNome: document.getElementById("hud-nome"),
  hudPontos: document.getElementById("hud-pontos"),
  hudAcertos: document.getElementById("hud-acertos"),
  hudErros: document.getElementById("hud-erros"),
  hudProgresso: document.getElementById("hud-progresso"),
  barra: document.getElementById("barra-preenchida"),
  mural: document.getElementById("mural-ao-vivo"),
  tag: document.getElementById("tag-estrutura"),
  figura: document.getElementById("figura"),
  enunciado: document.getElementById("enunciado"),
  opcoes: document.getElementById("opcoes"),
  feedback: document.getElementById("feedback"),
  rankingInicio: document.getElementById("ranking-inicio"),
  rankingJogo: document.getElementById("ranking-jogo"),
  rankingFinal: document.getElementById("ranking-final"),
  resultadoNome: document.getElementById("resultado-nome"),
  resultadoPontos: document.getElementById("resultado-pontos"),
  resultadoAcertos: document.getElementById("resultado-acertos"),
  resultadoErros: document.getElementById("resultado-erros")
};

// Embaralha um array (Fisher-Yates)
function embaralhar(arr) {
  const copia = [...arr];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

function trocarTela(tela) {
  [el.telaInicio, el.telaJogo, el.telaFinal].forEach((t) => t.classList.remove("ativa"));
  tela.classList.add("ativa");
}

// ---------- Ranking na tela ----------
async function renderizarRanking(ulElement, destacarNome = "") {
  const lista = await Ranking.listar(10);
  ulElement.innerHTML = "";

  if (!lista.length) {
    const li = document.createElement("li");
    li.className = "vazio";
    li.textContent = "Ninguém no ranking ainda. Seja o primeiro!";
    ulElement.appendChild(li);
    return;
  }

  lista.forEach((r) => {
    const li = document.createElement("li");
    if (destacarNome && r.nome === destacarNome) li.classList.add("eu");

    const nome = document.createElement("span");
    nome.className = "rk-nome";
    nome.textContent = r.nome;

    const pontos = document.createElement("span");
    pontos.className = "rk-pontos";
    pontos.textContent = `${r.pontos} pts`;

    li.appendChild(nome);
    li.appendChild(pontos);
    ulElement.appendChild(li);
  });
}

// Renderiza o ranking AO VIVO (pontuação parcial calculada dos eventos) na tela de jogo.
async function renderizarRankingAoVivo() {
  if (!el.rankingJogo) return;

  // Se estiver offline (sem Supabase), usa o ranking final salvo como fallback.
  const lista = Ranking.estaOnline()
    ? await Ranking.rankingAoVivo(PONTOS_POR_ACERTO, 10)
    : await Ranking.listar(10);

  el.rankingJogo.innerHTML = "";

  if (!lista.length) {
    const li = document.createElement("li");
    li.className = "vazio";
    li.textContent = "Ninguém pontuou ainda. Vai você!";
    el.rankingJogo.appendChild(li);
    return;
  }

  lista.forEach((r) => {
    const li = document.createElement("li");
    if (r.nome === estado.nome) li.classList.add("eu");

    const nome = document.createElement("span");
    nome.className = "rk-nome";
    nome.textContent = r.nome;

    const pontos = document.createElement("span");
    pontos.className = "rk-pontos";
    pontos.textContent = `${r.pontos} pts`;

    li.appendChild(nome);
    li.appendChild(pontos);
    el.rankingJogo.appendChild(li);
  });
}

// ---------- Fluxo do jogo ----------
function iniciarJogo() {
  const nome = el.nomeInput.value.trim();
  if (!nome) {
    el.nomeInput.focus();
    el.nomeInput.style.borderColor = "var(--erro)";
    return;
  }

  estado.nome = nome;
  estado.indice = 0;
  estado.pontos = 0;
  estado.acertos = 0;
  estado.erros = 0;
  estado.perguntas = embaralhar(PERGUNTAS);
  estado.respondida = false;

  el.hudNome.textContent = nome;
  atualizarHud();
  trocarTela(el.telaJogo);
  renderizarRankingAoVivo();
  mostrarPergunta();
}

function atualizarHud() {
  el.hudPontos.textContent = estado.pontos;
  el.hudAcertos.textContent = estado.acertos;
  el.hudErros.textContent = estado.erros;
  el.hudProgresso.textContent = `${estado.indice + 1}/${estado.perguntas.length}`;
  const pct = (estado.indice / estado.perguntas.length) * 100;
  el.barra.style.width = `${pct}%`;
}

function mostrarPergunta() {
  estado.respondida = false;
  const p = estado.perguntas[estado.indice];

  el.tag.textContent = p.estrutura;
  // Figura (SVG) opcional da pergunta
  if (p.figura) {
    el.figura.innerHTML = p.figura;
    el.figura.hidden = false;
  } else {
    el.figura.innerHTML = "";
    el.figura.hidden = true;
  }
  el.enunciado.textContent = p.enunciado;
  el.feedback.textContent = "";
  el.feedback.className = "feedback";
  el.btnProxima.hidden = true;
  el.opcoes.innerHTML = "";
  atualizarHud();

  // Embaralha as opções mantendo o rastro da correta
  const opcoesIndexadas = p.opcoes.map((texto, i) => ({ texto, correta: i === p.correta }));
  embaralhar(opcoesIndexadas).forEach((op) => {
    const btn = document.createElement("button");
    btn.className = "opcao";
    btn.textContent = op.texto;
    btn.addEventListener("click", () => responder(btn, op.correta, p.explicacao));
    el.opcoes.appendChild(btn);
  });
}

function responder(botao, acertou, explicacao) {
  if (estado.respondida) return;
  estado.respondida = true;

  const botoes = el.opcoes.querySelectorAll(".opcao");
  botoes.forEach((b) => (b.disabled = true));

  const estruturaAtual = estado.perguntas[estado.indice].estrutura;

  if (acertou) {
    botao.classList.add("correta");
    estado.acertos++;
    estado.pontos += PONTOS_POR_ACERTO;
    el.feedback.className = "feedback ok";
    el.feedback.textContent = `✅ Correto! ${explicacao}`;
  } else {
    botao.classList.add("errada");
    estado.erros++;
    el.feedback.className = "feedback nok";
    el.feedback.textContent = `❌ Ops! ${explicacao}`;
    // Destaca a resposta correta
    botoes.forEach((b) => {
      const p = estado.perguntas[estado.indice];
      if (b.textContent === p.opcoes[p.correta]) b.classList.add("correta");
    });
  }

  el.hudPontos.textContent = estado.pontos;
  el.hudAcertos.textContent = estado.acertos;
  el.hudErros.textContent = estado.erros;

  // Registra o evento no feed ao vivo (todos os jogadores veem)
  Ranking.registrarEvento({
    nome: estado.nome,
    estrutura: estruturaAtual,
    acertou: acertou
  });

  const ehUltima = estado.indice === estado.perguntas.length - 1;
  el.btnProxima.textContent = ehUltima ? "Ver resultado 🏁" : "Próxima ➡️";
  el.btnProxima.hidden = false;
}

// Mostra um box animado no mural ao vivo. Mantém no máximo 4 na tela.
function mostrarEventoAoVivo(evento) {
  if (!el.mural) return;

  const box = document.createElement("div");
  box.className = `evento-ao-vivo ${evento.acertou ? "ok" : "nok"}`;

  const icone = document.createElement("span");
  icone.className = "ev-icone";
  icone.textContent = evento.acertou ? "✅" : "❌";

  const nome = document.createElement("span");
  nome.className = "ev-nome";
  nome.textContent = evento.nome;

  const texto = document.createElement("span");
  texto.className = "ev-texto";
  texto.textContent = evento.acertou
    ? `acertou uma de ${evento.estrutura}!`
    : `errou uma de ${evento.estrutura}.`;

  box.appendChild(icone);
  box.appendChild(nome);
  box.appendChild(texto);
  el.mural.prepend(box);

  // Limita a quantidade visível
  while (el.mural.children.length > 4) {
    el.mural.removeChild(el.mural.lastChild);
  }

  // Remove após a animação de saída terminar
  setTimeout(() => box.remove(), 4200);
}

function proximaPergunta() {
  if (estado.indice < estado.perguntas.length - 1) {
    estado.indice++;
    mostrarPergunta();
  } else {
    finalizarJogo();
  }
}

async function finalizarJogo() {
  el.barra.style.width = "100%";

  el.resultadoNome.textContent = `Mandou bem, ${estado.nome}!`;
  el.resultadoPontos.textContent = estado.pontos;
  el.resultadoAcertos.textContent = estado.acertos;
  el.resultadoErros.textContent = estado.erros;

  trocarTela(el.telaFinal);

  await Ranking.salvar({
    nome: estado.nome,
    pontos: estado.pontos,
    acertos: estado.acertos,
    erros: estado.erros
  });

  await renderizarRanking(el.rankingFinal, estado.nome);
}

// ---------- Eventos ----------
el.btnIniciar.addEventListener("click", iniciarJogo);
el.nomeInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") iniciarJogo();
});
el.btnProxima.addEventListener("click", proximaPergunta);
el.btnNovamente.addEventListener("click", () => {
  el.nomeInput.value = "";
  trocarTela(el.telaInicio);
  renderizarRanking(el.rankingInicio);
});

// Atualização em tempo real: quando alguém termina, atualiza os rankings visíveis.
Ranking.aoAtualizar(() => {
  if (el.telaInicio.classList.contains("ativa")) renderizarRanking(el.rankingInicio);
  if (el.telaJogo.classList.contains("ativa")) renderizarRankingAoVivo();
  if (el.telaFinal.classList.contains("ativa")) renderizarRanking(el.rankingFinal, estado.nome);
});

// Feed ao vivo: mostra acertos/erros de qualquer jogador enquanto você joga.
Ranking.aoEvento((evento) => {
  // Só mostra na tela de jogo (é onde o mural existe)
  if (el.telaJogo.classList.contains("ativa")) {
    mostrarEventoAoVivo(evento);
    // Atualiza o placar parcial na hora
    renderizarRankingAoVivo();
  }
});

// Ao carregar
renderizarRanking(el.rankingInicio);
