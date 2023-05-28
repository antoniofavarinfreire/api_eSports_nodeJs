const express = require('express');
const mysql = require('mysql');

// Configurações do banco de dados
const dbConfig = {
  host: 'localhost',
  port : 3306,
  user: 'root',
  password: '',
  database: 'player',
};

// Criação da conexão com o banco de dados
const dbConnection = mysql.createConnection(dbConfig);

// Conexão com o banco de dados
dbConnection.connect((err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err);
    return;
  }
  console.log('Conexão estabelecida com o banco de dados MySQL.');
});

const app = express();
const port = 3000;

app.use(express.json());

// Rota para obter todos os jogadores
app.get('/players', (req, res) => {
  dbConnection.query('SELECT * FROM players', (err, results) => {
    if (err) {
      console.error('Erro ao obter os jogadores:', err);
      res.status(500).send('Erro ao obter os jogadores.');
    } else {
      res.json(results);
    }
  });
});

// Rota para obter um jogador pelo código
app.get('/players/:codigo', (req, res) => {
  const codigo = req.params.codigo;
  dbConnection.query('SELECT * FROM players WHERE codigo_jogador = ?', [codigo], (err, results) => {
    if (err) {
      console.error('Erro ao obter o jogador:', err);
      res.status(500).send('Erro ao obter o jogador.');
    } else if (results.length === 0) {
      res.status(404).send('Jogador não encontrado.');
    } else {
      res.json(results[0]);
    }
  });
});

// Rota para adicionar um novo jogador
app.post('/players', (req, res) => {
  const { codigo_jogador, nome_jogador, habilidade_principal } = req.body;
  const player = { codigo_jogador, nome_jogador, habilidade_principal };

  dbConnection.query('INSERT INTO players SET ?', player, (err, result) => {
    if (err) {
      console.error('Erro ao adicionar o jogador:', err);
      res.status(500).send('Erro ao adicionar o jogador.');
    } else {
      res.status(201).send('Jogador adicionado com sucesso.');
    }
  });
});

// Rota para atualizar um jogador pelo código
app.put('/players/:codigo', (req, res) => {
  const codigo = req.params.codigo;
  const { nome_jogador, habilidade_principal } = req.body;
  const player = { nome_jogador, habilidade_principal };

  dbConnection.query('UPDATE players SET ? WHERE codigo_jogador = ?', [player, codigo], (err, result) => {
    if (err) {
      console.error('Erro ao atualizar o jogador:', err);
      res.status(500).send('Erro ao atualizar o jogador.');
    } else if (result.affectedRows === 0) {
      res.status(404).send('Jogador não encontrado.');
    } else {
      res.send('Jogador atualizado com sucesso.');
    }
  });
});

// Rota para deletar um jogador pelo código
app.delete('/players/:codigo', (req, res) => {
  const codigo = req.params.codigo;

  dbConnection.query('DELETE FROM players WHERE codigo_jogador = ?', [codigo], (err, result) => {
    if (err) {
      console.error('Erro ao deletar o jogador:', err);
      res.status(500).send('Erro ao deletar o jogador.');
    } else if (result.affectedRows === 0) {
      res.status(404).send('Jogador não encontrado.');
    } else {
      res.send('Jogador deletado com sucesso.');
    }
  });
});

// Rota para buscar jogadores por habilidade principal
app.get('/players/habilidade/:habilidade', (req, res) => {
  const habilidade = req.params.habilidade;
  dbConnection.query('SELECT * FROM players WHERE habilidade_principal = ?', [habilidade], (err, results) => {
    if (err) {
      console.error('Erro ao buscar jogadores por habilidade:', err);
      res.status(500).send('Erro ao buscar jogadores por habilidade.');
    } else {
      res.json(results);
    }
  });
});

// Inicia o servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
