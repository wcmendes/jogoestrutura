// Banco de perguntas sobre estruturas de dados.
// Cada pergunta: estrutura, enunciado, opcoes[], correta (índice), explicacao.
const PERGUNTAS = [
  // ---------- LISTA ----------
  {
    estrutura: "Lista",
    enunciado: "O que caracteriza uma Lista como estrutura de dados?",
    opcoes: [
      "Uma coleção ordenada de elementos que permite inserir e remover em qualquer posição",
      "Uma estrutura onde só o último elemento pode ser acessado",
      "Uma tabela com linhas e colunas fixas",
      "Um único valor imutável"
    ],
    correta: 0,
    explicacao: "A Lista é uma coleção ordenada e flexível: dá pra inserir, remover e acessar elementos em várias posições."
  },
  {
    estrutura: "Lista",
    enunciado: "Numa lista [10, 20, 30], qual elemento está no índice 1?",
    opcoes: ["10", "20", "30", "Nenhum, listas não têm índice"],
    correta: 1,
    explicacao: "Índices geralmente começam em 0, então o índice 1 é o segundo elemento: 20."
  },

  // ---------- PILHA ----------
  {
    estrutura: "Pilha",
    enunciado: "Qual é o princípio de funcionamento de uma Pilha?",
    opcoes: [
      "FIFO — o primeiro a entrar é o primeiro a sair",
      "LIFO — o último a entrar é o primeiro a sair",
      "Acesso aleatório por índice",
      "Ordenação automática dos elementos"
    ],
    correta: 1,
    explicacao: "Pilha é LIFO (Last In, First Out). Pense numa pilha de pratos: você tira o de cima primeiro."
  },
  {
    estrutura: "Pilha",
    enunciado: "Empilho 1, depois 2, depois 3. Qual valor sai primeiro numa Pilha?",
    opcoes: ["1", "2", "3", "Sai tudo junto"],
    correta: 2,
    explicacao: "Como é LIFO, o último a entrar (3) é o primeiro a sair."
  },

  // ---------- FILA ----------
  {
    estrutura: "Fila",
    enunciado: "Qual é o princípio de funcionamento de uma Fila?",
    opcoes: [
      "LIFO — o último a entrar é o primeiro a sair",
      "FIFO — o primeiro a entrar é o primeiro a sair",
      "Acesso por chave-valor",
      "Sempre remove o maior elemento"
    ],
    correta: 1,
    explicacao: "Fila é FIFO (First In, First Out), igual a uma fila de banco: quem chega primeiro é atendido primeiro."
  },
  {
    estrutura: "Fila",
    enunciado: "Numa fila entram A, B, C nessa ordem. Quem é atendido primeiro?",
    opcoes: ["C", "B", "A", "Depende da prioridade"],
    correta: 2,
    explicacao: "Em uma fila comum (FIFO), quem entrou primeiro (A) sai primeiro."
  },

  // ---------- VETOR ----------
  {
    estrutura: "Vetor",
    enunciado: "O que melhor descreve um Vetor (array)?",
    opcoes: [
      "Uma coleção de elementos do mesmo tipo com tamanho fixo e acesso por índice",
      "Uma estrutura que cresce infinitamente sem custo",
      "Uma coleção que só guarda texto",
      "Uma estrutura sem ordem definida"
    ],
    correta: 0,
    explicacao: "O vetor tem tamanho definido e acesso direto por índice, geralmente com elementos do mesmo tipo."
  },
  {
    estrutura: "Vetor",
    enunciado: "Qual a principal vantagem do acesso a um elemento do vetor pelo índice?",
    opcoes: [
      "É lento porque percorre todos os elementos",
      "É acesso direto e rápido (tempo constante)",
      "Só funciona se o vetor estiver ordenado",
      "Precisa remover elementos antes"
    ],
    correta: 1,
    explicacao: "O acesso por índice é direto (O(1)): o computador calcula a posição na memória imediatamente."
  },

  // ---------- MATRIZ ----------
  {
    estrutura: "Matriz",
    enunciado: "O que é uma Matriz na programação?",
    opcoes: [
      "Um vetor de uma única dimensão",
      "Uma estrutura de dados de duas ou mais dimensões (linhas e colunas)",
      "Uma pilha de vetores que só cresce pra cima",
      "Uma lista sem índices"
    ],
    correta: 1,
    explicacao: "A matriz organiza dados em linhas e colunas, sendo um array de duas (ou mais) dimensões."
  },
  {
    estrutura: "Matriz",
    enunciado: "Na matriz M abaixo, qual valor está em M[1][2]?\n[ [1, 2, 3], [4, 5, 6] ]",
    opcoes: ["3", "4", "6", "2"],
    correta: 2,
    explicacao: "M[1] é a segunda linha [4,5,6]; o índice [2] dela é o terceiro valor: 6."
  },

  // ---------- REGISTRO ----------
  {
    estrutura: "Registro",
    enunciado: "O que é um Registro (struct)?",
    opcoes: [
      "Uma coleção de elementos do mesmo tipo acessados por índice",
      "Um agrupamento de campos (possivelmente de tipos diferentes) que representam uma entidade",
      "Uma estrutura que só aceita números",
      "Outro nome para pilha"
    ],
    correta: 1,
    explicacao: "Um registro agrupa campos relacionados, como Aluno { nome, idade, matricula }, mesmo com tipos diferentes."
  },
  {
    estrutura: "Registro",
    enunciado: "Considere o registro Aluno { nome: 'Ana', nota: 9.5 }. Como acessamos a nota?",
    opcoes: ["Aluno[0]", "Aluno.nota", "Aluno(nota)", "nota.Aluno"],
    correta: 1,
    explicacao: "Campos de um registro são acessados pelo nome, normalmente com ponto: Aluno.nota."
  }
];
