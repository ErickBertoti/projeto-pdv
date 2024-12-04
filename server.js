// Importa o Express, um framework para criar servidores web de maneira simples e eficiente
const express = require('express');

// Importa o Body-Parser, um middleware que facilita a leitura do corpo das requisições HTTP
// Ele interpreta o corpo das requisições e o transforma em um objeto JavaScript
const bodyParser = require('body-parser');

// Cria uma instância do servidor Express
// 'server' será utilizado para definir as rotas e iniciar o servidor
const server = express();

// Configura o Body-Parser para processar requisições com dados em JSON
// Isso permite que o servidor entenda requisições cujo corpo está no formato JSON
server.use(bodyParser.json());

// Exporta o servidor para que ele possa ser usado no arquivo principal (index.js)
module.exports = server;
