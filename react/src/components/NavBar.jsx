import { Disclosure } from '@headlessui/react';
import { Menu, Home, Users, Box, ShoppingCart, X } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function NavBar() {
  const location = useLocation();
  const [hoveredItem, setHoveredItem] = useState(null);

  const navigation = [
    { 
      name: 'Clientes', 
      current: location.pathname.includes('/clientes'), 
      href: '/clientes', 
      icon: Users,
      color: 'hover:text-green-400'
    },
    { 
      name: 'Produtos', 
      current: location.pathname.includes('/produtos'), 
      href: '/produtos', 
      icon: Box,
      color: 'hover:text-purple-400'
    },
    { 
      name: 'Ponto de Venda', 
      current: location.pathname === '/pdv', 
      href: '/pdv', 
      icon: ShoppingCart,
      color: 'hover:text-yellow-400'
    }
  ];

  return (
    <Disclosure as="nav" className="fixed w-full top-0 z-50 bg-gray-800">
      {({ open }) => (
        <>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative flex items-center justify-between h-16">
              {/* Mobile Menu Button */}
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                <Disclosure.Button className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700">
                  <span className="sr-only">Open main menu</span>
                  {open ? <X className="h-6 w-6 text-white" /> : <Menu className="h-6 w-6 text-white" />}
                </Disclosure.Button>
              </div>

              {/* Application Name */}
              <div className="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
                <Link to="/" className="flex-shrink-0 flex items-center text-white">
                  <h1 className="text-2xl font-bold text-white ml-3 tracking-tight">
                    Gerenciador de Vendas
                  </h1>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden sm:block sm:ml-6">
                  <div className="flex space-x-1">
                    {navigation.map((item) => {
                      const IconComponent = item.icon;
                      return (
                        <Link
                          key={item.name}
                          to={item.href}
                          onMouseEnter={() => setHoveredItem(item.name)}
                          onMouseLeave={() => setHoveredItem(null)}
                          className={classNames(
                            'px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-2 transition-all duration-200',
                            'hover:bg-gray-700 relative group',
                            item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:text-white',
                          )}
                        >
                          <IconComponent 
                            className={classNames(
                              'h-5 w-5 transition-all duration-200',
                              hoveredItem === item.name ? 'scale-110' : 'scale-100',
                              item.current ? 'text-white' : 'text-gray-400'
                            )}
                          />
                          <span>{item.name}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Navigation */}
          <Disclosure.Panel className="sm:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigation.map((item) => {
                const IconComponent = item.icon;
                return (
                  <Disclosure.Button
                    key={item.name}
                    as={Link}
                    to={item.href}
                    className={classNames(
                      'w-full flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium',
                      'transition-all duration-200 transform hover:scale-102',
                      item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    )}
                  >
                    <IconComponent className={classNames(
                      'h-5 w-5 transition-colors duration-200',
                      item.current ? 'text-white' : 'text-gray-400'
                    )} />
                    <span>{item.name}</span>
                  </Disclosure.Button>
                );
              })}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}