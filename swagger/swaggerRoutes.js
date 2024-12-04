// swaggerRoutes.js

const swaggerRoutes = {
    paths: {
      // Rotas de Clientes
      '/clientes': {
        post: {
          summary: 'Cria um novo cliente',
          tags: ['Clientes'],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    nome: { type: 'string', description: 'Nome do cliente' },
                    cpf: { type: 'string', description: 'CPF do cliente' },
                  },
                  example: {
                    nome: 'João Silva',
                    cpf: '12345678901',
                  },
                },
              },
            },
          },
          responses: {
            201: { description: 'Cliente criado com sucesso' },
            400: { description: 'Dados inválidos' },
          },
        },
        get: {
          summary: 'Retorna uma lista de todos os clientes',
          tags: ['Clientes'],
          responses: {
            200: {
              description: 'Lista de clientes',
              content: {
                'application/json': {
                  schema: { type: 'array', items: { type: 'object' } },
                },
              },
            },
          },
        },
      },
      '/clientes/{id}': {
        get: {
          summary: 'Busca um cliente pelo ID',
          tags: ['Clientes'],
          parameters: [
            {
              in: 'path',
              name: 'id',
              schema: { type: 'string' },
              required: true,
              description: 'ID do cliente',
            },
          ],
          responses: {
            200: { description: 'Dados do cliente' },
            404: { description: 'Cliente não encontrado' },
          },
        },
        put: {
          summary: 'Atualiza os dados de um cliente',
          tags: ['Clientes'],
          parameters: [
            {
              in: 'path',
              name: 'id',
              schema: { type: 'string' },
              required: true,
              description: 'ID do cliente',
            },
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    nome: { type: 'string', description: 'Nome do cliente' },
                    cpf: { type: 'string', description: 'CPF do cliente' },
                  },
                  example: {
                    nome: 'João da Silva',
                    cpf: '10987654321',
                  },
                },
              },
            },
          },
          responses: {
            200: { description: 'Cliente atualizado com sucesso' },
            404: { description: 'Cliente não encontrado' },
          },
        },
      },
  
      // Rotas de Produtos
      '/produtos': {
        post: {
          summary: 'Cria um novo produto',
          tags: ['Produtos'],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    Nome: { type: 'string', description: 'Nome do produto' },
                    Preco: { type: 'number', description: 'Preço do produto' },
                  },
                  example: {
                    Nome: 'Café',
                    Preco: 10.5,
                  },
                },
              },
            },
          },
          responses: {
            201: { description: 'Produto criado com sucesso' },
            400: { description: 'Dados inválidos' },
          },
        },
        get: {
          summary: 'Retorna uma lista de todos os produtos',
          tags: ['Produtos'],
          responses: {
            200: {
              description: 'Lista de produtos',
              content: {
                'application/json': {
                  schema: { type: 'array', items: { type: 'object' } },
                },
              },
            },
          },
        },
      },
      '/produtos/{id}': {
        get: {
          summary: 'Busca um produto pelo ID',
          tags: ['Produtos'],
          parameters: [
            {
              in: 'path',
              name: 'id',
              schema: { type: 'string' },
              required: true,
              description: 'ID do produto',
            },
          ],
          responses: {
            200: { description: 'Dados do produto' },
            404: { description: 'Produto não encontrado' },
          },
        },
        put: {
          summary: 'Atualiza os dados de um produto',
          tags: ['Produtos'],
          parameters: [
            {
              in: 'path',
              name: 'id',
              schema: { type: 'string' },
              required: true,
              description: 'ID do produto',
            },
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    Nome: { type: 'string', description: 'Nome do produto' },
                    Preco: { type: 'number', description: 'Preço do produto' },
                  },
                  example: {
                    Nome: 'Café Atualizado',
                    Preco: 12.0,
                  },
                },
              },
            },
          },
          responses: {
            200: { description: 'Produto atualizado com sucesso' },
            404: { description: 'Produto não encontrado' },
          },
        },
      },
  
      // Rotas de Ponto de Venda (PDV)
      '/pdv': {
        post: {
          summary: 'Gera um cupom de venda',
          tags: ['PDV'],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    clienteId: { type: 'string', description: 'ID do cliente' },
                    produtos: {
                      type: 'array',
                      items: { type: 'string' },
                      description: 'Lista de IDs dos produtos',
                    },
                    valorPago: { type: 'number', description: 'Valor pago pelo cliente' },
                  },
                  example: {
                    clienteId: 'AKGbQFASOCemzgRAisas',
                    produtos: ['DbuH9qVoGArCoi1Lv1I1', '3VRjdemuQ5UujSJVnxcJ'],
                    valorPago: 100.0,
                  },
                },
              },
            },
          },
          responses: {
            201: { description: 'Cupom de venda gerado com sucesso' },
            400: { description: 'Erro nos dados da requisição' },
          },
        },
      },
    },
  };
  
  module.exports = swaggerRoutes;
  