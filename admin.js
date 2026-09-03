// Página de administração: limpar ranking e eventos.
// Proteção simples por confirmação (digitar APAGAR), adequada a um jogo de sala de aula.

const elAdmin = {
  confirmar: document.getElementById("confirmar"),
  btnLimpar: document.getElementById("btn-limpar"),
  status: document.getElementById("status-admin"),
  ranking: document.getElementById("ranking-admin")
};

async function renderizar() {
  const lista = await Ranking.listar(50);
  elAdmin.ranking.innerHTML = "";

  if (!lista.length) {
    const li = document.createElement("li");
    li.className = "vazio";
    li.textContent = "Ranking vazio.";
    elAdmin.ranking.appendChild(li);
    return;
  }

  lista.forEach((r) => {
    const li = document.createElement("li");
    const nome = document.createElement("span");
    nome.className = "rk-nome";
    nome.textContent = r.nome;
    const pontos = document.createElement("span");
    pontos.className = "rk-pontos";
    pontos.textContent = `${r.pontos} pts`;
    li.appendChild(nome);
    li.appendChild(pontos);
    elAdmin.ranking.appendChild(li);
  });
}

// Só habilita o botão quando digitar exatamente APAGAR
elAdmin.confirmar.addEventListener("input", () => {
  elAdmin.btnLimpar.disabled = elAdmin.confirmar.value.trim().toUpperCase() !== "APAGAR";
});

elAdmin.btnLimpar.addEventListener("click", async () => {
  if (elAdmin.confirmar.value.trim().toUpperCase() !== "APAGAR") return;

  elAdmin.btnLimpar.disabled = true;
  elAdmin.status.className = "feedback";
  elAdmin.status.textContent = "Apagando...";

  try {
    await Ranking.limparTudo();
    elAdmin.status.className = "feedback ok";
    elAdmin.status.textContent = "✅ Tudo limpo! Ranking e eventos zerados.";
    elAdmin.confirmar.value = "";
    await renderizar();
  } catch (e) {
    console.error(e);
    elAdmin.status.className = "feedback nok";
    elAdmin.status.textContent = "❌ Não consegui limpar. Verifique se as policies de DELETE foram criadas no Supabase (supabase.sql).";
  }
});

renderizar();
