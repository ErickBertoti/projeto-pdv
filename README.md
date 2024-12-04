# PDV Node.js

Este é um projeto de um Sistema de Ponto de Venda (PDV) desenvolvido em Node.js com integração ao Firebase para armazenamento de dados de clientes e produtos. O sistema inclui rotas para gerenciar clientes, produtos e o ponto de venda, além de uma interface Swagger para visualizar e testar a API.


## Tecnologias Utilizadas

- Node.js
- Express
- Firebase
- Firestore
- dotenv
- Swagger

## Para rodar o projeto localmente, siga as etapas abaixo:

1. **Clone o repositório:**
   ```bash
    git clone https://github.com/seu-usuario/pdv-node.git

2. **Instale as dependências no diretório do projeto:**
   ```bash
    cd pdv-node
    npm install

3. **Configurações do Firebase:**
    **3.1** Crie um projeto no Firebase.
    **3.2** Configure o Firestore e obtenha as credenciais de acesso.
    **3.3** Crie um arquivo .env na raiz do projeto com a seguinte configuração:
   ```bash
    FIREBASE_API_KEY=your-api-key
    FIREBASE_AUTH_DOMAIN=your-auth-domain
    FIREBASE_PROJECT_ID=your-project-id
    FIREBASE_STORAGE_BUCKET=your-storage-bucket
    FIREBASE_MESSAGING_SENDER_ID=your-sender-id
    FIREBASE_APP_ID=your-app-id
    PORT=3000

2. **Inicialize o servidor:**
   ```bash
    npm start

- Quando o servidor iniciar, ele automaticamente populá as coleções de Clientes e Produtos no Firestore com dados iniciais, caso as coleções estejam vazias. Isso ocorre através das funções upsertClientes e upsertProdutos, garantindo que você tenha dados básicos para interagir com a API.
- O servidor estará rodando em http://localhost:3000.

## Swagger

- Este projeto também inclui a documentação interativa da API via Swagger. Para visualizar e testar os endpoints da API, acesse:

   ```bash
    http://localhost:3000/api-docs

