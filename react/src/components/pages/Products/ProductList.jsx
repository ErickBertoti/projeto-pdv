import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Trash2, Edit, PlusCircle, AlertCircle } from 'lucide-react';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:8080/produtos');
        setProducts(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Erro ao buscar produtos:', error);
        setError('Não foi possível carregar os produtos');
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/produtos/${id}`);
      setProducts(products.filter(product => product.id !== id));
      setDeleteConfirmation(null);
    } catch (error) {
      console.error('Erro ao excluir produto:', error);
      setError('Não foi possível excluir o produto');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative flex items-center">
        <AlertCircle className="mr-2 text-red-500" />
        <span>{error}</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-semibold text-gray-800">Produtos</h1>
        <Link
          to="/produtos/novo"
          className="flex items-center bg-blue-600 text-white px-5 py-3 rounded-lg hover:bg-blue-700 transition duration-300 ease-in-out shadow-md hover:shadow-lg"
        >
          <PlusCircle className="mr-2" /> Novo Produto
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 text-center text-gray-600 py-12 rounded-xl">
          Nenhum produto cadastrado
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="p-4 text-left text-gray-600 font-medium">Nome</th>
                <th className="p-4 text-left text-gray-600 font-medium">Preço</th>
                <th className="p-4 text-center text-gray-600 font-medium">Ações</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product.id} className="border-b hover:bg-gray-50 transition duration-200">
                  <td className="p-4">{product.Nome}</td>
                  <td className="p-4">R$ {product.Preco.toFixed(2)}</td>
                  <td className="p-4 text-center space-x-4">
                    <button
                      onClick={() => navigate(`/produtos/editar/${product.id}`)}
                      className="text-blue-500 hover:text-blue-700 transition"
                      title="Editar"
                    >
                      <Edit size={20} />
                    </button>
                    <button
                      onClick={() => setDeleteConfirmation(product.id)}
                      className="text-red-500 hover:text-red-700 transition"
                      title="Excluir"
                    >
                      <Trash2 size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {deleteConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 px-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Confirmar Exclusão</h2>
            <p className="mb-6 text-gray-600">Tem certeza que deseja excluir este produto?</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setDeleteConfirmation(null)}
                className="px-5 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmation)}
                className="px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductList;