const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json({ limit: '20mb' }));

const DB_FILE = path.join(__dirname, 'db.json');

// Inicializa o arquivo db.json caso não exista
if (!fs.existsSync(DB_FILE)) {
  const dadosIniciais = {
    barbeiros: [{ id: "1", nome: "Mariana Costa", foto: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150" }],
    agendamentos: [],
    produtos: [],
    vendasAvulsas: [],
    configSite: {
      whats: "5513999999999",
      horarioTxt: "TER - SÁB | 08H - 19H",
      endereco: "Rua Santo Antônio, 622 - Vila Caiçara - Praia Grande/SP"
    }
  };
  fs.writeFileSync(DB_FILE, JSON.stringify(dadosIniciais, null, 2));
}

function lerBanco() {
  return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
}

function salvarBanco(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

// ROTAS API
app.get('/api/ping', (req, res) => res.json({ status: 'OK' }));

app.get('/api/config-site', (req, res) => {
  const db = lerBanco();
  res.json(db.configSite || {});
});

app.put('/api/config-site', (req, res) => {
  const db = lerBanco();
  db.configSite = { ...db.configSite, ...req.body };
  salvarBanco(db);
  res.json({ sucesso: true, config: db.configSite });
});

app.get('/api/barbeiros', (req, res) => {
  const db = lerBanco();
  res.json(db.barbeiros || []);
});

app.post('/api/barbeiros', (req, res) => {
  const db = lerBanco();
  const novo = { id: Date.now().toString(), ...req.body };
  db.barbeiros.push(novo);
  salvarBanco(db);
  res.json({ sucesso: true, barbeiro: novo });
});

app.get('/api/agendamentos', (req, res) => {
  const db = lerBanco();
  res.json(db.agendamentos || []);
});

app.post('/api/enviar-email-confirmacao', (req, res) => {
  const db = lerBanco();
  const novo = { id: Date.now().toString(), ...req.body };
  db.agendamentos.push(novo);
  salvarBanco(db);
  res.json({ sucesso: true, agendamento: novo });
});

app.delete('/api/agendamentos/:id', (req, res) => {
  const db = lerBanco();
  db.agendamentos = db.agendamentos.filter(a => a.id !== req.params.id);
  salvarBanco(db);
  res.json({ sucesso: true });
});

// ROTAS DE PRODUTOS E VENDAS
app.get('/api/produtos', (req, res) => {
  const db = lerBanco();
  res.json(db.produtos || []);
});

app.post('/api/produtos', (req, res) => {
  const db = lerBanco();
  const novo = { id: Date.now().toString(), ...req.body };
  db.produtos = db.produtos || [];
  db.produtos.push(novo);
  salvarBanco(db);
  res.json({ sucesso: true, produto: novo });
});

app.get('/api/vendas', (req, res) => {
  const db = lerBanco();
  res.json(db.vendasAvulsas || []);
});

app.post('/api/vendas', (req, res) => {
  const db = lerBanco();
  const novaVenda = { id: Date.now().toString(), ...req.body };
  db.vendasAvulsas = db.vendasAvulsas || [];
  db.vendasAvulsas.push(novaVenda);
  salvarBanco(db);
  res.json({ sucesso: true, venda: novaVenda });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`));
