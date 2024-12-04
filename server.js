// Importa o Express, um framework para criar servidores web de maneira simples e eficiente
const express = require('express');

// Importa o Body-Parser, um middleware que facilita a leitura do corpo das requisições HTTP
const bodyParser = require('body-parser');

// Importa o CORS, um middleware para lidar com permissões de requisições entre origens diferentes
const cors = require('cors');

// Cria uma instância do servidor Express
const server = express();

// Configura o middleware CORS para permitir requisições da origem 'http://localhost:3000'
// Isso é necessário para que o frontend e o backend possam se comunicar
server.use(cors({
  origin: 'http://localhost:3000', // Permite requisições apenas desta origem
}));

// Configura o Body-Parser para processar requisições com dados em JSON
server.use(bodyParser.json());

// Exporta o servidor para que ele possa ser usado no arquivo principal (index.js)
module.exports = server;
