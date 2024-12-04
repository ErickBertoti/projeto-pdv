import React from 'react';
import ReactDOM from 'react-dom/client';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import NavBar from './components/NavBar'; // Importa o NavBar
import CustomerList from './components/pages/Customers/CustomerList';
import CustomerForm from './components/pages/Customers/CustomerForm';
import ProductList from './components/pages/Products/ProductList';
import ProductForm from './components/pages/Products/ProductForm';
import PointOfSale from './components/pages/PDV/PointOfSale';

import './index.css'; // Importa o CSS global

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <NavBar /> {/* Inclui o NavBar fixo no topo */}
      <div className="mt-16"> {/* Ajusta o espaço para compensar o NavBar fixo */}
        <Routes>
          <Route path="/clientes" element={<CustomerList />} />
          <Route path="/clientes/novo" element={<CustomerForm />} />
          <Route path="/clientes/editar/:id" element={<CustomerForm />} />
          
          <Route path="/produtos" element={<ProductList />} />
          <Route path="/produtos/novo" element={<ProductForm />} />
          <Route path="/produtos/editar/:id" element={<ProductForm />} />
          
          <Route path="/pdv" element={<PointOfSale />} />
        </Routes>
      </div>
    </Router>
  </React.StrictMode>
);
