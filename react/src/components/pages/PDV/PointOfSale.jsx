import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  ShoppingCart, 
  User, 
  CreditCard, 
  Check, 
  X, 
  Printer 
} from 'lucide-react';

const PointOfSale = () => {
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [valorPago, setValorPago] = useState('');
  const [receipt, setReceipt] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [customersResponse, productsResponse] = await Promise.all([
          axios.get('http://localhost:8080/clientes'),
          axios.get('http://localhost:8080/produtos')
        ]);
        setCustomers(customersResponse.data);
        setProducts(productsResponse.data);
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
        setError('Não foi possível carregar clientes e produtos');
      }
    };
    fetchData();
  }, []);

  const handleSale = async () => {
    setError('');
    try {
      const response = await axios.post('http://localhost:8080/pdv', {
        clienteId: selectedCustomer,
        produtos: selectedProducts,
        valorPago: parseFloat(valorPago)
      });
      setReceipt(response.data);
      resetForm();
    } catch (error) {
      console.error('Erro ao processar venda:', error);
      setError(error.response?.data || 'Erro ao processar venda');
    }
  };

  const resetForm = () => {
    setSelectedCustomer('');
    setSelectedProducts([]);
    setValorPago('');
  };

  const calculateTotal = () => {
    return selectedProducts.reduce((total, prodId) => {
      const product = products.find(p => p.id === prodId);
      return total + (product ? product.Preco : 0);
    }, 0);
  };

  const printReceipt = () => {
    window.print();
  };

  return (
    <div className="container mx-auto p-6 bg-gray-100 min-h-screen">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <ShoppingCart className="mr-3 text-blue-600" />
            Ponto de Venda
          </h2>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
              <X className="absolute top-3 right-3 cursor-pointer" onClick={() => setError('')} />
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block mb-2 font-semibold flex items-center">
                <User className="mr-2 text-gray-500" /> 
                Cliente
              </label>
              <select 
                value={selectedCustomer} 
                onChange={(e) => setSelectedCustomer(e.target.value)}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Selecione um cliente</option>
                {customers.map(customer => (
                  <option key={customer.id} value={customer.id}>
                    {customer.nome}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-2 font-semibold">Produtos</label>
              <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto border rounded-md p-2">
                {products.map(product => (
                  <div 
                    key={product.id} 
                    className="flex items-center hover:bg-gray-100 p-2 rounded"
                  >
                    <input 
                      type="checkbox" 
                      id={product.id} 
                      checked={selectedProducts.includes(product.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedProducts([...selectedProducts, product.id]);
                        } else {
                          setSelectedProducts(selectedProducts.filter(id => id !== product.id));
                        }
                      }}
                      className="mr-2 form-checkbox text-blue-600"
                    />
                    <label 
                      htmlFor={product.id} 
                      className="flex justify-between w-full"
                    >
                      <span>{product.Nome}</span>
                      <span className="text-green-600">R$ {product.Preco.toFixed(2)}</span>
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block mb-2 font-semibold flex items-center">
                <CreditCard className="mr-2 text-gray-500" />
                Valor Pago
              </label>
              <input 
                type="number" 
                value={valorPago} 
                onChange={(e) => setValorPago(e.target.value)}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Digite o valor pago"
                min="0"
                step="0.01"
              />
            </div>

            <div className="flex justify-between items-center mt-4">
              <strong className="text-lg">Total: R$ {calculateTotal().toFixed(2)}</strong>
              
              <button 
                onClick={handleSale}
                className="flex items-center bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 disabled:opacity-50"
                disabled={!selectedCustomer || selectedProducts.length === 0 || !valorPago}
              >
                <Check className="mr-2" /> Processar Venda
              </button>
            </div>
          </div>
        </div>

        {receipt && (
          <div className="bg-white p-6 rounded-lg shadow-md print:block">
            <h3 className="text-2xl font-bold mb-6 flex justify-between items-center">
              Cupom Fiscal
              <button 
                onClick={printReceipt} 
                className="text-blue-500 hover:text-blue-700"
                title="Imprimir Cupom"
              >
                <Printer />
              </button>
            </h3>
            
            <div className="space-y-4">
              <div className="bg-gray-100 p-4 rounded">
                <p><strong>Cliente:</strong> {receipt.cliente.nome}</p>
                <p><strong>CPF:</strong> {receipt.cliente.cpf}</p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Itens:</h4>
                {receipt.itens.map((item, index) => (
                  <div 
                    key={index} 
                    className="flex justify-between border-b py-2 last:border-b-0"
                  >
                    <span>{item.nome}</span>
                    <span>R$ {item.valor_unitario.toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="bg-gray-100 p-4 rounded mt-4 space-y-2">
                <div className="flex justify-between font-bold">
                  <span>Total:</span>
                  <span>R$ {receipt.valor_total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Valor Pago:</span>
                  <span>R$ {receipt.valor_pago.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-green-600">
                  <span>Troco:</span>
                  <span>R$ {receipt.troco.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PointOfSale;