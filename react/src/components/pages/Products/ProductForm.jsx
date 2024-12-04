import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { AlertCircle, CheckCircle, XCircle } from 'lucide-react';

const ProductForm = () => {
  const [Nome, setNome] = useState('');
  const [Preco, setPreco] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;

  useEffect(() => {
    if (isEditing) {
      const fetchProduct = async () => {
        try {
          const response = await axios.get(`http://localhost:8080/produtos/${id}`);
          setNome(response.data.Nome);
          setPreco(response.data.Preco.toFixed(2));
        } catch (error) {
          setError('Erro ao carregar dados do produto');
          console.error('Erro ao buscar produto:', error);
        }
      };
      fetchProduct();
    }
  }, [id, isEditing]);

  const handlePriceChange = (value) => {
    // Remove non-numeric characters except decimal point
    const cleanedValue = value.replace(/[^\d.]/g, '');
    
    // Ensure only one decimal point
    const parts = cleanedValue.split('.');
    if (parts.length > 2) {
      return;
    }
    
    // Limit to two decimal places
    if (parts[1] && parts[1].length > 2) {
      parts[1] = parts[1].slice(0, 2);
    }
    
    setPreco(parts.join('.'));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    // Validate price
    const parsedPrice = parseFloat(Preco);
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      setError('Preço inválido');
      setIsSubmitting(false);
      return;
    }

    try {
      const productData = {
        Nome,
        Preco: parsedPrice
      };

      if (isEditing) {
        await axios.put(`http://localhost:8080/produtos/${id}`, productData);
      } else {
        await axios.post('http://localhost:8080/produtos', productData);
      }
      navigate('/produtos');
    } catch (error) {
      setError('Erro ao salvar produto');
      console.error('Erro ao salvar produto:', error);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-lg">
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
        <h1 className="text-3xl font-semibold mb-6 text-gray-800 text-center">
          {isEditing ? 'Editar Produto' : 'Novo Produto'}
        </h1>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded flex items-center">
            <AlertCircle className="mr-3 text-red-500" />
            <span className="font-medium">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 font-medium mb-2">Nome do Produto</label>
            <input
              type="text"
              value={Nome}
              onChange={(e) => setNome(e.target.value)}
              required
              placeholder="Digite o nome do produto"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300"
            />
          </div>
          
          <div>
            <label className="block text-gray-700 font-medium mb-2">Preço</label>
            <div className="relative">
              <span className="absolute left-4 top-3.5 text-gray-500">R$</span>
              <input
                type="text"
                value={Preco}
                onChange={(e) => handlePriceChange(e.target.value)}
                required
                placeholder="0.00"
                className="w-full pl-10 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300"
              />
            </div>
          </div>

          <div className="flex justify-between items-center pt-4">
            <button
              type="button"
              onClick={() => navigate('/produtos')}
              className="text-gray-600 hover:text-gray-800 transition flex items-center"
            >
              <XCircle className="mr-2 text-gray-500" /> Cancelar
            </button>
            
            <button
              type="submit"
              disabled={isSubmitting}
              className={`
                flex items-center px-6 py-3 rounded-lg transition duration-300 ease-in-out
                ${isSubmitting 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
                }
              `}
            >
              <CheckCircle className="mr-2" />
              {isSubmitting 
                ? 'Processando...' 
                : (isEditing ? 'Atualizar' : 'Salvar')
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;