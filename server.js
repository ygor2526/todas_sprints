import express from 'express';

const app = express();
const porta = 3000;

// Dados simulados
const mensagens = [
  { id: 1, usuario: "Ana", texto: "Bom dia!" },
  { id: 2, usuario: "Pedro", texto: "Olá!" },
  { id: 3, usuario: "Maria", texto: "Tudo bem?" },
  { id: 4, usuario: "Lucas", texto: "Como vai?" },
  { id: 5, usuario: "Carla", texto: "Até logo!" }
];

const ajudas = [
  {
    status: "Status do servidor",
    informacao: "informações importantes",
    cursos: "Ver os cursos disponiveis",
    professor: "Informações sobre o professor"
  }
];

// Funções auxiliares
function listarMensagens() {
  return mensagens;
}

function consultar(falhar = false) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      falhar
        ? reject(new Error('Falhou'))
        : resolve(mensagens);
    }, 1000);
  });
}

// --- ROTAS ---

app.get('/', (req, res) => {
  res.send('Servidor Node.js com Express funcionando!');
});

app.get('/status', (req, res) => {
  res.json({ status: "online", sprint: 3 });
});

app.get('/boas-vindas', (req, res) => {
  res.send('Bem-vindo ao servidor Node.js com Express!');
});

app.get('/sobre', (req, res) => {
  res.send('Projeto Mensageiro Local');
});

app.get('/escola', (req, res) => {
  res.json({
    nome: 'Escola Técnica Horizonte',
    cidade: 'Campinas',
    tipo: 'Ensino Técnico'
  });
});

app.get('/cursos', (req, res) => {
  res.json([
    { id: 1, nome: 'Desenvolvimento de Sistemas' },
    { id: 2, nome: 'Redes de Computadores' },
    { id: 3, nome: 'Administração' }
  ]);
});

app.get('/professor', (req, res) => {
  res.json({
    nome: 'Carlos Oliveira',
    disciplina: 'Programação Back-End'
  });
});

app.get('/ajuda', (req, res) => {
  res.json(ajudas);
});

app.get('/requisicao', (req, res) => {
  res.json({
    metodo: req.method,
    caminho: req.path,
    mensagem: 'Solicitação recebida com sucesso!'
  });
});

app.get('/mensagens', (req, res) => {
  res.json(listarMensagens());
});

app.get('/mensagens/:id', (req, res) => {
  const mensagem = mensagens.find(m => m.id === Number(req.params.id));
  if (!mensagem) {
    return res.status(404).json({ erro: "Não encontrada" });
  }
  res.json(mensagem);
});

app.get('/total-mensagens', (req, res) => {
  res.json({ total: mensagens.length });
});

// (Sprint 3)
app.get('/consulta-async', async (req, res) => {
  try {
    const dados = await consultar(false);
    res.json(dados);
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
});

app.listen(porta, '0.0.0.0', () => {
  console.log(`Servidor rodando em http://localhost:${porta}`);
});

// GET/ mensagens-then
app.get("/mensagens-then", (req, res) => {
  consultar()
    .then(lista => res.json(lista))
    .catch(() => res.status(500).json({ erro: "Falha na consulta" }));
});

//GET/ mensagens-async
app.get("/mensagens-async", async (req, res) => {
  try {
    res.json(await consultar());
  } catch (erro) {
    res.status(500).json({
      erro: "Falha na consulta"
    });
  }
});

//GET/ mensagens-erro
app.get("/mensagens-erro", async (req, res) => {
  try {
    res.json(await consultar(true));
  } catch (erro) {
    res.status(500).json({
      erro: "Falha simulada"
    });
  }
});
