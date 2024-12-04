// Importa as funções do Firestore para manipular o banco de dados
const { collection, doc, addDoc, getDocs, getDoc, updateDoc, deleteDoc } = require('firebase/firestore');

// Importa a instância do Firestore ('db') criada no arquivo 'firebase.js'
const db = require('../db/firebase');


// Função que define as rotas relacionadas aos clientes
const clientesRoutes = (server) => {
  
  
  // Rota para criar um novo cliente. Recebe dados via POST e armazena um novo cliente no Firestore.
  server.post('/clientes', async (req, res) => {
    try {
      // Desestrutura o corpo da requisição para obter 'nome' e 'cpf' do cliente
      const { nome, cpf } = req.body;

      // Validação simples para garantir que 'nome' e 'cpf' sejam fornecidos
      if (!nome || !cpf) {
        return res.status(400).send('Os campos "nome" e "cpf" são obrigatórios.');
      }

      // Adiciona o cliente no Firestore, criando um novo documento na coleção 'Clientes'
      const docRef = await addDoc(collection(db, 'Clientes'), { nome, cpf });

      // Retorna uma resposta com o ID do cliente recém-criado
      res.status(201).send(`Cliente adicionado com ID: ${docRef.id}`);
    } catch (error) {
      // Caso ocorra algum erro, retorna uma mensagem de erro com status 500
      res.status(500).send('Erro ao adicionar cliente: ' + error.message);
    }
  });

  // Rota para listar todos os clientes armazenados no Firestore. Retorna uma lista com todos os clientes.
  server.get('/clientes', async (req, res) => {
    try {
      // Busca todos os documentos da coleção 'Clientes'
      const querySnapshot = await getDocs(collection(db, 'Clientes'));

      // Mapeia os documentos para um array contendo os dados dos clientes (incluindo ID)
      const clientes = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      // Retorna a lista de clientes com status 200 (sucesso)
      res.status(200).json(clientes);
    } catch (error) {
      // Em caso de erro, retorna uma mensagem de erro com status 500
      res.status(500).send('Erro ao buscar clientes: ' + error.message);
    }
  });

  // Rota para buscar um cliente específico pelo ID. O ID é passado como parâmetro na URL.
  server.get('/clientes/:id', async (req, res) => {
    try {
      // Extrai o ID do cliente dos parâmetros da URL
      const { id } = req.params;

      // Cria uma referência ao documento no Firestore usando o ID fornecido
      const clienteRef = doc(db, 'Clientes', id);

      // Busca o documento no Firestore
      const clienteSnap = await getDoc(clienteRef);

      // Verifica se o documento (cliente) existe. Se não, retorna um erro 404 (não encontrado)
      if (!clienteSnap.exists()) {
        return res.status(404).send('Cliente não encontrado.');
      }

      // Se o cliente for encontrado, retorna os dados do cliente com status 200
      res.status(200).json({ id: clienteSnap.id, ...clienteSnap.data() });
    } catch (error) {
      // Em caso de erro, retorna uma mensagem de erro com status 500
      res.status(500).send('Erro ao buscar cliente: ' + error.message);
    }
  });

  // Rota para atualizar um cliente específico pelo ID. Recebe novos dados via PUT.
  server.put('/clientes/:id', async (req, res) => {
    try {
      // Extrai o ID do cliente dos parâmetros da URL
      const { id } = req.params;

      // Extrai os novos valores de 'nome' e 'cpf' do corpo da requisição
      const { nome, cpf } = req.body;

      // Validação simples para garantir que 'nome' e 'cpf' sejam fornecidos
      if (!nome || !cpf) {
        return res.status(400).send('Os campos "nome" e "cpf" são obrigatórios.');
      }

      // Cria uma referência ao documento no Firestore usando o ID fornecido
      const clienteRef = doc(db, 'Clientes', id);

      // Atualiza o documento no Firestore com os novos valores fornecidos
      await updateDoc(clienteRef, { nome, cpf });

      // Retorna uma mensagem confirmando a atualização do cliente com status 200
      res.status(200).send(`Cliente com ID ${id} atualizado com sucesso.`);
    } catch (error) {
      // Em caso de erro, retorna uma mensagem de erro com status 500
      res.status(500).send('Erro ao atualizar cliente: ' + error.message);
    }
  });

  // Rota para remover um cliente específico pelo ID. O ID é passado como parâmetro na URL.
  server.delete('/clientes/:id', async (req, res) => {
    try {
      // Extrai o ID do cliente dos parâmetros da URL
      const { id } = req.params;

      // Cria uma referência ao documento no Firestore usando o ID fornecido
      const clienteRef = doc(db, 'Clientes', id);

      // Busca o documento no Firestore
      const clienteSnap = await getDoc(clienteRef);

      // Verifica se o documento (cliente) existe. Se não, retorna um erro 404 (não encontrado)
      if (!clienteSnap.exists()) {
        return res.status(404).send('Cliente não encontrado.');
      }

      // Remove o documento do Firestore
      await deleteDoc(clienteRef);

      // Retorna uma mensagem confirmando a remoção do cliente com status 200
      res.status(200).send(`Cliente com ID ${id} foi removido.`);
    } catch (error) {
      // Em caso de erro, retorna uma mensagem de erro com status 500
      res.status(500).send('Erro ao remover cliente: ' + error.message);
    }
  });
};

// Exporta a função 'clientesRoutes' para que possa ser usada no arquivo principal (index.js)
module.exports = clientesRoutes;
