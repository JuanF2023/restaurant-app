import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MesaModal from '../components/ui/MesaModal';
import { UtensilsCrossed, ShoppingBag, User } from 'lucide-react';

const mesasIniciales = [
  { id: 1, ocupada: false },
  { id: 2, ocupada: false },
  { id: 3, ocupada: false },
  { id: 4, ocupada: false },
  { id: 5, ocupada: false },
];

const HomePage = () => {
  const navigate = useNavigate();
  const [mesas, setMesas] = useState(mesasIniciales);
  const [tipoOrden, setTipoOrden] = useState('');
  const [mesaSeleccionada, setMesaSeleccionada] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);

  const handleTipoOrden = (tipo) => {
    setTipoOrden(tipo);
  };

  const seleccionarMesa = (mesa) => {
    if (mesa.ocupada) return;
    setMesaSeleccionada(mesa.id);
    setMostrarModal(true);
  };

  const confirmarCantidad = (cantidad) => {
    setMesas(mesas.map(m => m.id === mesaSeleccionada ? { ...m, ocupada: true } : m));
    setMostrarModal(false);
    navigate(`/orden/${mesaSeleccionada}`, {
      state: { mesaId: mesaSeleccionada, tipoOrden, cantidad }
    });
  };

  return (
    <div className="flex flex-wrap gap-6">
      {/* Botones de tipo de orden */}
      <div className="flex flex-col gap-4 w-full max-w-md">
        <button
          className="w-full flex items-center justify-center gap-3 text-xl font-bold bg-green-600 hover:bg-green-700 text-white py-5 rounded-md border border-white shadow transition-all"
          onClick={() => handleTipoOrden('adentro')}
        >
          <UtensilsCrossed size={32} className="text-black drop-shadow" />
          Para comer adentro
        </button>

        <button
          className="w-full flex items-center justify-center gap-3 text-xl font-bold bg-green-600 hover:bg-green-700 text-white py-5 rounded-md border border-white shadow transition-all"
          onClick={() => handleTipoOrden('llevar')}
        >
          <ShoppingBag size={32} className="text-black drop-shadow" />
          Para llevar
        </button>

        <button
          className="w-full flex items-center justify-center gap-3 text-xl font-bold bg-green-600 hover:bg-green-700 text-white py-5 rounded-md border border-white shadow transition-all"
          onClick={() => handleTipoOrden('empleado')}
        >
          <User size={32} className="text-black drop-shadow" />
          Comida empleado
        </button>
      </div>

      {/* Botones de mesas */}
      {tipoOrden === 'adentro' && (
        <div className="flex flex-wrap gap-4">
          {mesas.map((mesa) => (
            <button
              key={mesa.id}
              className={`w-24 h-36 font-bold rounded border border-white text-white transition-all duration-200 ${
                mesa.ocupada
                  ? 'bg-red-600 cursor-not-allowed'
                  : 'bg-green-600 hover:bg-green-700'
              }`}
              onClick={() => seleccionarMesa(mesa)}
            >
              Mesa {mesa.id}
            </button>
          ))}
        </div>
      )}

      {/* Modal de cantidad */}
      <MesaModal
        isOpen={mostrarModal}
        mesaId={mesaSeleccionada}
        onClose={() => setMostrarModal(false)}
        onConfirm={confirmarCantidad}
      />
    </div>
  );
};

export default HomePage;
