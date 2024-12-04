// Importa funções do Firestore necessárias para manipulação de dados
// Essas funções permitem interagir com o banco de dados (adicionar, buscar, atualizar e remover dados)
// Está importando o módulo Firestore da biblioteca Firebase, que é usado para interagir com o banco de dados Firestore no Firebase.
// a desestruturação permite extrair apenas as funções que você precisa e usá-las diretamente
const { collection, doc, addDoc, getDocs, getDoc, updateDoc, deleteDoc } = require('firebase/firestore');

// Importa a instância do Firestore ('db') criada no arquivo 'firebase.js'
// Isso nos permite acessar e manipular dados no Firestore
const db = require('../db/firebase');


// Função que define todas as rotas relacionadas aos produtos
// As rotas permitem criar, listar, buscar por ID, atualizar e remover produtos no banco de dados Firestore
const produtosRoutes = (server) => {

  // Rota para criar um novo produto. Recebe dados via POST e armazena um novo produto no Firestore.
  server.post('/produtos', async (req, res) => {
    try {
      // Desestrutura o corpo da requisição para obter os campos 'Nome' e 'Preco' do produto
      const { Nome, Preco } = req.body;

      // Adiciona o produto no Firestore, criando um novo documento na coleção 'Produtos'
      const docRef = await addDoc(collection(db, 'Produtos'), { Nome, Preco });

      // Retorna uma resposta com o ID do produto recém-criado
      res.status(201).send(`Produto adicionado com ID: ${docRef.id}`);
    } catch (error) {
      // Caso ocorra algum erro, retorna uma mensagem de erro com status 500
      res.status(500).send('Erro ao adicionar produto: ' + error.message);
    }
  });

  // Rota para listar todos os produtos armazenados no Firestore. Retorna uma lista com todos os produtos.
  server.get('/produtos', async (req, res) => {
    try {
      // Busca todos os documentos da coleção 'Produtos'
      const querySnapshot = await getDocs(collection(db, 'Produtos'));

      // Mapeia os documentos para um array contendo os dados dos produtos (incluindo ID)
      const produtos = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      // Retorna a lista de produtos com status 200 (sucesso)
      res.status(200).json(produtos);
    } catch (error) {
      // Em caso de erro, retorna uma mensagem de erro com status 500
      res.status(500).send('Erro ao buscar produtos: ' + error.message);
    }
  });

  // Rota para buscar um produto específico pelo ID. O ID é passado como parâmetro na URL.
  server.get('/produtos/:id', async (req, res) => {
    try {
      // Extrai o ID do produto dos parâmetros da URL
      const { id } = req.params;

      // Cria uma referência ao documento no Firestore usando o ID fornecido
      const produtoRef = doc(db, 'Produtos', id);

      // Busca o documento no Firestore
      const produtoSnap = await getDoc(produtoRef);

      // Verifica se o documento (produto) existe. Se não, retorna um erro 404 (não encontrado)
      if (!produtoSnap.exists()) {
        return res.status(404).send('Produto não encontrado.');
      }

      // Se o produto for encontrado, retorna os dados do produto com status 200
      res.status(200).json({ id: produtoSnap.id, ...produtoSnap.data() });
    } catch (error) {
      // Em caso de erro, retorna uma mensagem de erro com status 500
      res.status(500).send('Erro ao buscar produto: ' + error.message);
    }
  });

  // Rota para atualizar um produto específico pelo ID. Recebe novos dados via PUT.
  server.put('/produtos/:id', async (req, res) => {
    try {
      // Extrai o ID do produto dos parâmetros da URL
      const { id } = req.params;

      // Extrai os novos valores de 'Nome' e 'Preco' do corpo da requisição
      const { Nome, Preco } = req.body;

      // Cria uma referência ao documento no Firestore usando o ID fornecido
      const produtoRef = doc(db, 'Produtos', id);

      // Atualiza o documento no Firestore com os novos valores fornecidos
      await updateDoc(produtoRef, { Nome, Preco });

      // Retorna uma mensagem confirmando a atualização do produto com status 200
      res.status(200).send(`Produto com ID ${id} atualizado com sucesso.`);
    } catch (error) {
      // Em caso de erro, retorna uma mensagem de erro com status 500
      res.status(500).send('Erro ao atualizar produto: ' + error.message);
    }
  });

  // Rota para remover um produto específico pelo ID. O ID é passado como parâmetro na URL.
  server.delete('/produtos/:id', async (req, res) => {
    try {
      // Extrai o ID do produto dos parâmetros da URL
      const { id } = req.params;

      // Cria uma referência ao documento no Firestore usando o ID fornecido
      const produtoRef = doc(db, 'Produtos', id);

      // Busca o documento no Firestore
      const produtoSnap = await getDoc(produtoRef);

      // Verifica se o documento (produto) existe. Se não, retorna um erro 404 (não encontrado)
      if (!produtoSnap.exists()) {
        return res.status(404).send('Produto não encontrado.');
      }

      // Remove o documento do Firestore
      await deleteDoc(produtoRef);

      // Retorna uma mensagem confirmando a remoção do produto com status 200
      res.status(200).send(`Produto com ID ${id} foi removido.`);
    } catch (error) {
      // Em caso de erro, retorna uma mensagem de erro com status 500
      res.status(500).send('Erro ao remover produto: ' + error.message);
    }
  });
};

// Exporta a função 'produtosRoutes' para que possa ser usada no arquivo principal (index.js)
module.exports = produtosRoutes;
