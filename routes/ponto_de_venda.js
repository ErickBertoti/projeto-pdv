const { collection, doc, getDoc } = require('firebase/firestore');
const db = require('../db/firebase');


const pdvRoutes = (server) => {
  server.post('/pdv', async (req, res) => {
    try {
      const { produtos, clienteId, valorPago } = req.body;

      if (!produtos || produtos.length === 0 || !clienteId || valorPago == null) {
        return res.status(400).send('Os campos "produtos", "clienteId" e "valorPago" são obrigatórios.');
      }

      //Busca dados do cliente
      const clienteRef = doc(db, 'Clientes', clienteId);
      const clienteSnap = await getDoc(clienteRef);

      if (!clienteSnap.exists()) {
        return res.status(404).send('Cliente não encontrado.');
      }

      const cliente = clienteSnap.data();

      //Busca dados dos produtos
      let itensCupom = [];
      let valorTotal = 0;

      for (const produtoId of produtos) {
        const produtoRef = doc(db, 'Produtos', produtoId);
        const produtoSnap = await getDoc(produtoRef);

        if (produtoSnap.exists()) {
          const produto = produtoSnap.data();

          itensCupom.push({
            nome: produto.Nome || 'Nome não disponível',
            descricao: produto.Descricao || 'Descrição não disponível',
            valor_unitario: produto.Preco || 0
          });

          valorTotal += produto.Preco || 0;
        } else {
          return res.status(404).send(`Produto com ID ${produtoId} não encontrado.`);
        }
      }

      //Cálculo do troco
      if (valorPago < valorTotal) {
        return res.status(400).send('Valor pago insuficiente para cobrir o total da compra.');
      }

      const troco = parseFloat((valorPago - valorTotal).toFixed(2));

      //Gera o cupom
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

      //Retorna o cupom
      res.status(201).json(cupom);
      
    } catch (error) {
      console.error('Erro ao gerar cupom:', error);
      res.status(500).send('Erro ao gerar cupom: ' + error.message);
    }
  });
};

module.exports = pdvRoutes;
