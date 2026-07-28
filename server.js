const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json({ limit: '20mb' }));

app.use(express.static(__dirname));

const DB_FILE = path.join(__dirname, 'db.json');

if (!fs.existsSync(DB_FILE)) {
  const dadosIniciais = {
    barbeiros: [{ id: "1", nome: "Mariana Costa", foto: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150" }],
    agendamentos: [],
    produtos: [],
    vendasAvulsas: []
  };
  fs.writeFileSync(DB_FILE, JSON.stringify(dadosIniciais, null, 2));
}

function lerBanco() {
  return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
}

function salvarBanco(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Servidor PWA rodando na porta ${PORT}`));
