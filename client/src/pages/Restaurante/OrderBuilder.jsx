import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const sampleMenu = {
  comidas: [
    { id: 1, nombre: 'Hamburguesa', precio: 8.99 },
    { id: 2, nombre: 'Pizza', precio: 10.99 },
  ],
  bebidas: [
    { id: 3, nombre: 'Coca Cola', precio: 1.99 },
    { id: 4, nombre: 'Jugo de naranja', precio: 2.49 },
  ],
  extras: [
    { id: 5, nombre: 'Papas fritas', precio: 3.49 },
  ],
};

const OrderBuilder = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { mesaId } = useParams();
  const [carrito, setCarrito] = useState([]);

  // Recuperar estado si existe
  const estado = location.state || {};
  const tipoOrden = estado.tipoOrden || localStorage.getItem('tipoOrden');
  const cantidad = estado.cantidad || localStorage.getItem('cantidad');

  // Si el state no existe, evitar error
  useEffect(() => {
    if (!estado.tipoOrden) {
      // Intenta restaurar desde localStorage
      if (estado.mesaId) {
        localStorage.setItem('tipoOrden', estado.tipoOrden);
        localStorage.setItem('cantidad', estado.cantidad);
      } else {
        navigate('/home');
      }
    }
  }, []);

  const agregarAlCarrito = (producto) => {
    setCarrito((prev) => [...prev, producto]);
  };

  const total = carrito.reduce((sum, item) => sum + item.precio, 0).toFixed(2);

  return (
    <div className="p-6 text-white min-h-screen bg-slate-900">
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate('/home')}
          className="text-yellow-400 hover:text-yellow-300"
        >
          <ArrowLeft size={28} />
        </button>
        <div>
          <h1 className="text-3xl font-bold">
            Mesa {mesaId} - {tipoOrden}
          </h1>
          {cantidad && (
            <p className="text-gray-400">Cantidad de personas: {cantidad}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(sampleMenu).map(([categoria, productos]) => (
          <div key={categoria} className="bg-slate-800 p-4 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold capitalize mb-4 border-b border-yellow-400 pb-2">{categoria}</h2>
            <ul className="space-y-3">
              {productos.map((item) => (
                <li key={item.id} className="flex justify-between items-center">
                  <span>{item.nombre} <span className="text-sm text-gray-400">(${item.precio.toFixed(2)})</span></span>
                  <button
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded-md"
                    onClick={() => agregarAlCarrito(item)}
                  >
                    Agregar
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Carrito */}
      <div className="mt-10 bg-slate-800 p-4 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4 border-b border-yellow-400 pb-2">Resumen de la orden</h2>
        {carrito.length === 0 ? (
          <p className="text-gray-400">No hay productos en la orden.</p>
        ) : (
          <ul className="space-y-2 mb-4">
            {carrito.map((item, index) => (
              <li key={index} className="flex justify-between">
                <span>{item.nombre}</span>
                <span>${item.precio.toFixed(2)}</span>
              </li>
            ))}
          </ul>
        )}
        <div className="text-right font-bold text-xl">Total: ${total}</div>
      </div>
    </div>
  );
};

export default OrderBuilder;
