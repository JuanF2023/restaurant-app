import React from 'react';

const MesaModal = ({ isOpen, onClose, mesaId, onConfirm }) => {
  const [cantidad, setCantidad] = React.useState('');

  const handleConfirm = () => {
    const num = parseInt(cantidad);
    if (!isNaN(num) && num > 0) {
      onConfirm(num);
      setCantidad('');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-80 text-gray-800">
        <h2 className="text-lg font-bold mb-4">¿Cuántas personas hay en la Mesa {mesaId}?</h2>
        <input
          type="number"
          value={cantidad}
          onChange={(e) => setCantidad(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Ej: 2"
        />
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 text-sm"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 rounded bg-green-600 hover:bg-green-700 text-white font-semibold text-sm"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
};

export default MesaModal;
