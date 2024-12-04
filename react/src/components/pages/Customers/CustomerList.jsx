import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Trash2, Edit, PlusCircle, AlertCircle } from 'lucide-react';

const CustomerList = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await axios.get('http://localhost:8080/clientes');
        setCustomers(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Erro ao buscar clientes:', error);
        setError('Não foi possível carregar os clientes');
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/clientes/${id}`);
      setCustomers(customers.filter(customer => customer.id !== id));
      setDeleteConfirmation(null);
    } catch (error) {
      console.error('Erro ao excluir cliente:', error);
      setError('Não foi possível excluir o cliente');
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
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Clientes</h1>
        <Link
          to="/clientes/novo"
          className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
        >
          <PlusCircle className="mr-2" /> Novo Cliente
        </Link>
      </div>

      {customers.length === 0 ? (
        <div className="text-center text-gray-500 py-10">
          Nenhum cliente cadastrado
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="p-3 text-left text-gray-600 font-semibold">Nome</th>
                <th className="p-3 text-left text-gray-600 font-semibold">CPF</th>
                <th className="p-3 text-center text-gray-600 font-semibold">Ações</th>
              </tr>
            </thead>
            <tbody>
              {customers.map(customer => (
                <tr key={customer.id} className="border-b hover:bg-gray-50 transition">
                  <td className="p-3">{customer.nome}</td>
                  <td className="p-3">{customer.cpf}</td>
                  <td className="p-3 text-center space-x-4">
                    <button
                      onClick={() => navigate(`/clientes/editar/${customer.id}`)}
                      className="text-blue-500 hover:text-blue-700 transition"
                      title="Editar"
                    >
                      <Edit size={20} />
                    </button>
                    <button
                      onClick={() => setDeleteConfirmation(customer.id)}
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-xl">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Confirmar Exclusão</h2>
            <p className="mb-6 text-gray-600">Tem certeza que deseja excluir este cliente?</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setDeleteConfirmation(null)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmation)}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
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

export default CustomerList;