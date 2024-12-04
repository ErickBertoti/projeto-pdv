const { collection, doc, addDoc, getDoc } = require('firebase/firestore');
const db = require('../db/firebase');

const pdvRoutes = (server) => {
  // Rota para registrar uma venda no PDV
  server.post('/pdv', async (req, res) => {
    try {
      // Desestrutura o corpo da requisição para obter produtos, ID do cliente e valor pago
      const { produtos, clienteId, valorPago } = req.body;

      // Validação para garantir que os campos essenciais sejam fornecidos
      if (!produtos || produtos.length === 0 || !clienteId || valorPago == null) {
        return res.status(400).send('Os campos "produtos", "clienteId" e "valorPago" são obrigatórios.');
      }

      // Busca dados do cliente
      const clienteRef = doc(db, 'Clientes', clienteId);
      const clienteSnap = await getDoc(clienteRef);

      // Verifica se o cliente existe
      if (!clienteSnap.exists()) {
        return res.status(404).send('Cliente não encontrado.');
      }

      const cliente = clienteSnap.data();

      // Busca dados dos produtos
      let itensCupom = [];
      let valorTotal = 0;

      // Itera sobre os produtos para obter detalhes e calcular valor total
      for (const produtoId of produtos) {
        const produtoRef = doc(db, 'Produtos', produtoId);
        const produtoSnap = await getDoc(produtoRef);

        if (produtoSnap.exists()) {
          const produto = produtoSnap.data();

          // Adiciona o produto ao cupom fiscal
          itensCupom.push({
            nome: produto.Nome || 'Nome não disponível',
            descricao: produto.Descricao || 'Descrição não disponível',
            valor_unitario: produto.Preco || 0
          });

          // Calcula o valor total
          valorTotal += produto.Preco || 0;
        } else {
          return res.status(404).send(`Produto com ID ${produtoId} não encontrado.`);
        }
      }

      // Verifica se o valor pago é suficiente
      if (valorPago < valorTotal) {
        return res.status(400).send('Valor pago insuficiente para cobrir o total da compra.');
      }

      // Calcula o troco
      const troco = parseFloat((valorPago - valorTotal).toFixed(2));

      // Gera o cupom fiscal
      const cupom = {
        cliente: {
          nome: cliente.nome,
          cpf: cliente.cpf
        },
        itens: itensCupom,
        valor_total: parseFloat(valorTotal.toFixed(2)),
        valor_pago: parseFloat(valorPago.toFixed(2)),
        troco: troco
      };

      // Adiciona o cupom à coleção de Vendas no Firestore
      const vendaRef = await addDoc(collection(db, 'Vendas'), cupom);

      // Retorna o cupom com o ID da venda
      res.status(201).json({ ...cupom, id: vendaRef.id });

    } catch (error) {
      console.error('Erro ao gerar cupom:', error);
      res.status(500).send('Erro ao gerar cupom: ' + error.message);
    }
  });
};

module.exports = pdvRoutes;