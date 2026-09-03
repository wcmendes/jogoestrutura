// Banco de perguntas sobre estruturas de dados.
// Cada pergunta: estrutura, enunciado, figura (SVG opcional), opcoes[], correta (índice), explicacao.

// ---------- Ilustrações SVG reutilizáveis ----------
const FIG = {
  // Lista encadeada: nós com setas
  lista: `
    <svg viewBox="0 0 360 90" class="fig">
      ${[0,1,2].map((i)=>`
        <g transform="translate(${20+i*115},25)">
          <rect width="80" height="40" rx="8" fill="#242a52" stroke="#6c5ce7"/>
          <text x="40" y="26" text-anchor="middle" fill="#eef0ff" font-size="16">${[10,20,30][i]}</text>
        </g>
        ${i<2?`<path d="M${100+i*115},45 L${135+i*115},45" stroke="#8f7bff" stroke-width="3" marker-end="url(#seta)"/>`:``}
      `).join("")}
      <defs><marker id="seta" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#8f7bff"/></marker></defs>
    </svg>`,

  // Pilha: caixas empilhadas com topo indicado
  pilha: `
    <svg viewBox="0 0 220 170" class="fig">
      ${[0,1,2].map((i)=>`
        <g transform="translate(60,${20+i*40})">
          <rect width="100" height="34" rx="6" fill="#242a52" stroke="#6c5ce7"/>
          <text x="50" y="23" text-anchor="middle" fill="#eef0ff" font-size="15">${[3,2,1][i]}</text>
        </g>
      `).join("")}
      <text x="175" y="42" fill="#8f7bff" font-size="13">← topo</text>
    </svg>`,

  // Fila: caixas com entrada e saída
  fila: `
    <svg viewBox="0 0 380 110" class="fig">
      <text x="20" y="35" fill="#8f7bff" font-size="13">entra →</text>
      ${[0,1,2].map((i)=>`
        <g transform="translate(${95+i*80},25)">
          <rect width="66" height="40" rx="8" fill="#242a52" stroke="#6c5ce7"/>
          <text x="33" y="26" text-anchor="middle" fill="#eef0ff" font-size="15">${["A","B","C"][i]}</text>
        </g>
      `).join("")}
      <text x="335" y="35" fill="#8f7bff" font-size="13">→ sai</text>
      <text x="95" y="85" fill="#a6acd8" font-size="12">frente</text>
      <text x="250" y="85" fill="#a6acd8" font-size="12">fim</text>
    </svg>`,

  // Vetor: células contíguas com índices
  vetor: `
    <svg viewBox="0 0 380 90" class="fig">
      ${[0,1,2,3,4].map((i)=>`
        <g transform="translate(${20+i*70},20)">
          <rect width="60" height="40" fill="#242a52" stroke="#6c5ce7"/>
          <text x="30" y="26" text-anchor="middle" fill="#eef0ff" font-size="15">${[5,8,1,9,4][i]}</text>
          <text x="30" y="58" text-anchor="middle" fill="#a6acd8" font-size="12">[${i}]</text>
        </g>
      `).join("")}
    </svg>`,

  // Matriz: grade 2x3
  matriz: `
    <svg viewBox="0 0 260 140" class="fig">
      ${[0,1].map((l)=>[0,1,2].map((c)=>`
        <g transform="translate(${20+c*70},${20+l*50})">
          <rect width="60" height="40" fill="#242a52" stroke="#6c5ce7"/>
          <text x="30" y="26" text-anchor="middle" fill="#eef0ff" font-size="15">${[[1,2,3],[4,5,6]][l][c]}</text>
        </g>`).join("")).join("")}
    </svg>`,

  // Registro: um bloco com campos nomeados
  registro: `
    <svg viewBox="0 0 260 150" class="fig">
      <rect x="30" y="15" width="200" height="120" rx="10" fill="#1b1f3b" stroke="#6c5ce7"/>
      <text x="130" y="38" text-anchor="middle" fill="#8f7bff" font-size="14">Aluno</text>
      ${[["nome","Ana"],["idade","20"],["nota","9.5"]].map(([k,v],i)=>`
        <text x="50" y="${68+i*22}" fill="#a6acd8" font-size="13">${k}:</text>
        <text x="150" y="${68+i*22}" fill="#eef0ff" font-size="13">${v}</text>
      `).join("")}
    </svg>`
};

const PERGUNTAS = [
  // ---------- LISTA ----------
  {
    estrutura: "Lista",
    figura: FIG.lista,
    enunciado: "Observando a lista encadeada acima, o que a caracteriza?",
    opcoes: [
      "Coleção ordenada onde cada nó aponta para o próximo, permitindo inserir/remover em várias posições",
      "Estrutura onde só o último elemento pode ser acessado",
      "Uma tabela fixa de linhas e colunas",
      "Um único valor imutável"
    ],
    correta: 0,
    explicacao: "Na lista encadeada cada nó guarda um valor e aponta para o próximo, dando flexibilidade para inserir e remover."
  },
  {
    estrutura: "Lista",
    figura: FIG.lista,
    enunciado: "Na lista [10, 20, 30] acima, qual elemento está no índice 1?",
    opcoes: ["10", "20", "30", "Listas não têm índice"],
    correta: 1,
    explicacao: "Os índices começam em 0, então o índice 1 é o segundo elemento: 20."
  },
  {
    estrutura: "Lista",
    enunciado: "Qual operação é típica de uma lista, mas NÃO de uma pilha ou fila comum?",
    opcoes: [
      "Inserir um elemento em uma posição qualquer do meio",
      "Remover sempre do topo",
      "Remover sempre da frente",
      "Não permitir remoção"
    ],
    correta: 0,
    explicacao: "A lista permite inserir/remover em qualquer posição; pilha e fila restringem onde isso acontece."
  },

  // ---------- PILHA ----------
  {
    estrutura: "Pilha",
    figura: FIG.pilha,
    enunciado: "Pela pilha acima, qual é o princípio de funcionamento?",
    opcoes: [
      "FIFO — o primeiro a entrar é o primeiro a sair",
      "LIFO — o último a entrar é o primeiro a sair",
      "Acesso aleatório por índice",
      "Ordenação automática dos elementos"
    ],
    correta: 1,
    explicacao: "Pilha é LIFO. Como uma pilha de pratos: você retira o de cima (o último colocado) primeiro."
  },
  {
    estrutura: "Pilha",
    figura: FIG.pilha,
    enunciado: "Empilhando 1, depois 2, depois 3 (como na figura), qual sai primeiro?",
    opcoes: ["1", "2", "3", "Sai tudo junto"],
    correta: 2,
    explicacao: "Sendo LIFO, o último a entrar (3, que está no topo) é o primeiro a sair."
  },
  {
    estrutura: "Pilha",
    enunciado: "Como se chamam as operações de inserir e remover em uma pilha?",
    opcoes: ["enqueue e dequeue", "push e pop", "add e get", "insert e delete"],
    correta: 1,
    explicacao: "Na pilha usamos push (empilhar) e pop (desempilhar)."
  },
  {
    estrutura: "Pilha",
    enunciado: "Qual destes é um uso clássico de pilha?",
    opcoes: [
      "Botão 'desfazer' (Ctrl+Z) de um editor",
      "Fila de impressão de documentos",
      "Planilha de duas dimensões",
      "Cadastro de um aluno"
    ],
    correta: 0,
    explicacao: "O 'desfazer' remove sempre a última ação feita — comportamento LIFO, típico de pilha."
  },

  // ---------- FILA ----------
  {
    estrutura: "Fila",
    figura: FIG.fila,
    enunciado: "Pela fila acima, qual é o princípio de funcionamento?",
    opcoes: [
      "LIFO — o último a entrar é o primeiro a sair",
      "FIFO — o primeiro a entrar é o primeiro a sair",
      "Acesso por chave-valor",
      "Sempre remove o maior elemento"
    ],
    correta: 1,
    explicacao: "Fila é FIFO, igual a uma fila de banco: quem chega primeiro é atendido primeiro."
  },
  {
    estrutura: "Fila",
    figura: FIG.fila,
    enunciado: "Na fila acima entram A, B, C nessa ordem. Quem sai primeiro?",
    opcoes: ["C", "B", "A", "Depende da prioridade"],
    correta: 2,
    explicacao: "Em uma fila comum (FIFO), quem entrou primeiro (A, na frente) sai primeiro."
  },
  {
    estrutura: "Fila",
    enunciado: "Como se chamam as operações de inserir e remover em uma fila?",
    opcoes: ["push e pop", "enqueue e dequeue", "top e peek", "set e get"],
    correta: 1,
    explicacao: "Na fila usamos enqueue (inserir no fim) e dequeue (remover da frente)."
  },
  {
    estrutura: "Fila",
    enunciado: "Qual destes é um uso clássico de fila?",
    opcoes: [
      "Fila de impressão de documentos",
      "Botão desfazer de um editor",
      "Acesso direto a M[2][3]",
      "Guardar campos de um aluno"
    ],
    correta: 0,
    explicacao: "Documentos são impressos na ordem em que chegaram — comportamento FIFO, típico de fila."
  },

  // ---------- VETOR ----------
  {
    estrutura: "Vetor",
    figura: FIG.vetor,
    enunciado: "Observando o vetor acima, o que melhor o descreve?",
    opcoes: [
      "Células contíguas de tamanho fixo, acessadas diretamente por índice",
      "Uma estrutura que cresce infinitamente sem custo",
      "Uma coleção que só guarda texto",
      "Uma estrutura sem ordem definida"
    ],
    correta: 0,
    explicacao: "O vetor ocupa posições contíguas na memória, com tamanho definido e acesso direto por índice."
  },
  {
    estrutura: "Vetor",
    figura: FIG.vetor,
    enunciado: "No vetor acima, qual valor está no índice [3]?",
    opcoes: ["1", "8", "9", "4"],
    correta: 2,
    explicacao: "Contando a partir de [0]: 5, 8, 1, 9... o índice [3] é 9."
  },
  {
    estrutura: "Vetor",
    enunciado: "Qual a vantagem de acessar um elemento do vetor pelo índice?",
    opcoes: [
      "É lento porque percorre todos os elementos",
      "É acesso direto e rápido (tempo constante)",
      "Só funciona se estiver ordenado",
      "Precisa remover elementos antes"
    ],
    correta: 1,
    explicacao: "O acesso por índice é direto (O(1)): a posição na memória é calculada de imediato."
  },
  {
    estrutura: "Vetor",
    enunciado: "No contexto clássico (C, Java, Pascal), os elementos de um vetor são:",
    opcoes: [
      "De tipos totalmente diferentes entre si",
      "Todos do mesmo tipo",
      "Sempre números inteiros apenas",
      "Sem tipo definido"
    ],
    correta: 1,
    explicacao: "Nas linguagens clássicas o vetor é homogêneo: todos os elementos têm o mesmo tipo."
  },

  // ---------- MATRIZ ----------
  {
    estrutura: "Matriz",
    figura: FIG.matriz,
    enunciado: "Pela grade acima, o que é uma matriz?",
    opcoes: [
      "Um vetor de uma única dimensão",
      "Uma estrutura de duas ou mais dimensões (linhas e colunas)",
      "Uma pilha de vetores que só cresce pra cima",
      "Uma lista sem índices"
    ],
    correta: 1,
    explicacao: "A matriz organiza dados em linhas e colunas — um array de duas (ou mais) dimensões."
  },
  {
    estrutura: "Matriz",
    figura: FIG.matriz,
    enunciado: "Na matriz acima, qual valor está em M[1][2]?",
    opcoes: ["3", "4", "6", "2"],
    correta: 2,
    explicacao: "M[1] é a segunda linha [4,5,6]; o índice [2] dela é 6."
  },
  {
    estrutura: "Matriz",
    figura: FIG.matriz,
    enunciado: "A matriz acima tem quantas linhas e colunas?",
    opcoes: ["3 linhas e 2 colunas", "2 linhas e 3 colunas", "6 linhas e 1 coluna", "1 linha e 6 colunas"],
    correta: 1,
    explicacao: "São 2 linhas ([1,2,3] e [4,5,6]) e 3 colunas — uma matriz 2x3."
  },

  // ---------- REGISTRO ----------
  {
    estrutura: "Registro",
    figura: FIG.registro,
    enunciado: "Pelo registro Aluno acima, o que é um Registro (struct)?",
    opcoes: [
      "Uma coleção de elementos do mesmo tipo acessados por índice",
      "Um agrupamento de campos (possivelmente de tipos diferentes) que representa uma entidade",
      "Uma estrutura que só aceita números",
      "Outro nome para pilha"
    ],
    correta: 1,
    explicacao: "O registro agrupa campos relacionados, como Aluno { nome, idade, nota }, mesmo com tipos diferentes."
  },
  {
    estrutura: "Registro",
    figura: FIG.registro,
    enunciado: "No registro acima, como acessamos o valor do campo 'nota'?",
    opcoes: ["Aluno[0]", "Aluno.nota", "Aluno(nota)", "nota.Aluno"],
    correta: 1,
    explicacao: "Campos de um registro são acessados pelo nome, normalmente com ponto: Aluno.nota."
  }
];
