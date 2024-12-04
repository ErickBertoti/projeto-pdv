import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { AlertCircle, CheckCircle, XCircle } from 'lucide-react';

const CustomerForm = () => {
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;

  useEffect(() => {
    if (isEditing) {
      const fetchCustomer = async () => {
        try {
          const response = await axios.get(`http://localhost:8080/clientes/${id}`);
          setNome(response.data.nome);
          setCpf(response.data.cpf);
        } catch (error) {
          setError('Erro ao carregar dados do cliente');
          console.error('Erro ao buscar cliente:', error);
        }
      };
      fetchCustomer();
    }
  }, [id, isEditing]);

  const formatCPF = (value) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
      .slice(0, 14);
  };

  const handleCPFChange = (e) => {
    setCpf(formatCPF(e.target.value));
  };

  const validateCPF = (cpf) => {
    cpf = cpf.replace(/[^\d]+/g, '');
    if (cpf.length !== 11) return false;
    
    // Basic CPF validation
    let sum = 0;
    let remainder;

    for (let i = 1; i <= 9; i++) 
      sum = sum + parseInt(cpf.substring(i-1, i)) * (11 - i);
    
    remainder = (sum * 10) % 11;
    if ((remainder === 10) || (remainder === 11)) remainder = 0;
    if (remainder !== parseInt(cpf.substring(9, 10))) return false;

    sum = 0;
    for (let i = 1; i <= 10; i++) 
      sum = sum + parseInt(cpf.substring(i-1, i)) * (12 - i);
    
    remainder = (sum * 10) % 11;
    if ((remainder === 10) || (remainder === 11)) remainder = 0;
    return remainder === parseInt(cpf.substring(10, 11));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    // Validate CPF
    if (!validateCPF(cpf)) {
      setError('CPF inválido');
      setIsSubmitting(false);
      return;
    }

    try {
      if (isEditing) {
        await axios.put(`http://localhost:8080/clientes/${id}`, { nome, cpf });
      } else {
        await axios.post('http://localhost:8080/clientes', { nome, cpf });
      }
      navigate('/clientes');
    } catch (error) {
      setError('Erro ao salvar cliente');
      console.error('Erro ao salvar cliente:', error);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        {isEditing ? 'Editar Cliente' : 'Novo Cliente'}
      </h1>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative mb-4 flex items-center" role="alert">
          <AlertCircle className="mr-2 text-red-500" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Nome Completo</label>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
            placeholder="Digite o nome completo"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-gray-700 font-semibold mb-2">CPF</label>
          <input
            type="text"
            value={cpf}
            onChange={handleCPFChange}
            required
            maxLength="14"
            placeholder="000.000.000-00"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex justify-between items-center">
          <button
            type="button"
            onClick={() => navigate('/clientes')}
            className="text-gray-600 hover:text-gray-800 transition"
          >
            <XCircle className="mr-2 inline-block" /> Cancelar
          </button>
          
          <button
            type="submit"
            disabled={isSubmitting}
            className={`
              flex items-center px-4 py-2 rounded-md transition
              ${isSubmitting 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
              }
            `}
          >
            <CheckCircle className="mr-2 inline-block" />
            {isSubmitting 
              ? 'Processando...' 
              : (isEditing ? 'Atualizar' : 'Salvar')
            }
          </button>
        </div>
      </form>
    </div>
  );
};

export default CustomerForm;