import React, { useState } from 'react';
import { Trash2, ArrowRight, LogIn, Coffee, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';


const PIN_LENGTH = 4;


const LoginPage = () => {
  const [pin, setPin] = useState('');
  const [activeUser, setActiveUser] = useState(1);

  // Para los usuarios activos (ejemplo)
  const usuarios = [
    { id: 1, nombre: 'Usuario 1', pin: '', },
    { id: 2, nombre: 'Usuario 2', pin: '', },
  ];

  // Manejo de teclado
  const handleDigit = (digit) => {
    if (pin.length < PIN_LENGTH) setPin(pin + digit);
  };
  const handleClear = () => setPin('');
  const handleBackspace = () => setPin(pin.slice(0, -1));
  const navigate = useNavigate(); // ← agrégalo dentro del componente

  const handleContinue = () => {
    showAlert('Ingreso exitoso.');
    setTimeout(() => {
      navigate('/home');
    }, 800);
  };
  

  // Alerta moderna usando toast simple 
  const showAlert = (msg) => {
    const toast = document.createElement('div');
    toast.className =
      'fixed top-6 right-6 bg-green-600 text-white font-bold rounded-lg shadow-lg px-6 py-4 z-50 animate-bounce-in flex items-center gap-2';
    toast.innerHTML = `<svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 13l4 4L19 7"/></svg> ${msg}`;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2200);
  };

  // Estilo personalizado ancho extra
  const cardWidth = 'w-[900px] max-w-[95vw]';

  return (
    <div className="min-h-screen bg-gradient-to-r from-slate-900 to-gray-800 flex items-center justify-center text-white">
      <div className={`rounded-2xl shadow-2xl p-10 bg-slate-800 flex flex-col md:flex-row gap-8 ${cardWidth}`}>
        {/* IZQUIERDA */}
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold">Restaurante 01</h1>
              <div className="text-sm font-semibold text-blue-200 mt-1">Tablet 1</div>
            </div>
            <div className="text-sm text-gray-200 mt-1">
              {(() => {
                const fecha = new Intl.DateTimeFormat('es-ES', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                }).format(new Date());

                // Capitaliza la primera letra del mes
                return fecha.replace(/([a-zñáéíóú])/i, (match) => match.toUpperCase());
              })()}

            </div>
          </div>
          {/* Visualización del PIN */}
          <div className="flex justify-center gap-6 mt-7 mb-4">
            {[...Array(PIN_LENGTH)].map((_, idx) => (
              <span
                key={idx}
                className={`inline-block w-16 h-5 rounded-full ${idx < pin.length ? 'bg-green-400' : 'bg-gray-500'
                  } transition-all`}
              />
            ))}
          </div>
          {/* TECLADO NUMÉRICO */}
          <div className="grid grid-cols-3 gap-4 mt-3 mb-5 max-w-[500px] mx-auto">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
              <button
                key={n}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-2xl rounded-lg py-4 shadow"
                onClick={() => handleDigit(String(n))}
              >
                {n}
              </button>
            ))}
            {/* Limpiar */}
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg rounded-lg py-4 flex items-center justify-center gap-2 shadow"
              onClick={handleClear}
            >
              <Trash2 size={22} /> Limpiar
            </button>
            {/* 0 */}
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-2xl rounded-lg py-4 shadow"
              onClick={() => handleDigit('0')}
            >
              0
            </button>
            {/* Backspace */}
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-2xl rounded-lg py-4 flex items-center justify-center shadow"
              onClick={handleBackspace}
            >
              ←
            </button>
          </div>
          {/* Botón Continuar */}
          <button
            className="w-full bg-green-600 hover:bg-green-700 transition-colors text-white font-bold rounded-lg text-lg py-4 flex items-center justify-center gap-2 mt-2 shadow"
            onClick={handleContinue}
          >
            <ArrowRight size={24} /> Continuar
          </button>
        </div>

        {/* DERECHA */}
        <div className="flex-1 flex flex-col justify-between">
          {/* Usuarios activos */}
          <div className="w-full flex flex-col items-center">
            <div className="font-bold mb-3 text-lg text-center">Usuarios activos</div>
            {usuarios.map((u) => (
              <div className="flex items-center gap-2 mb-3" key={u.id}>
                <span className="whitespace-nowrap text-sm">Juan Carlos Flores {u.id}:</span>
                <button
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded flex items-center gap-1"
                  onClick={() => showAlert(`Limpiado Usuario ${u.id}`)}
                >
                  <Trash2 size={18} /> Limpiar
                </button>
              </div>
            ))}
          </div>


          {/* Botones de acción */}
          <div className="flex flex-col gap-4 mt-8 items-center">
          <button
  className="w-[50%] bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 text-lg shadow"
  onClick={() => {
    showAlert('Ingreso exitoso.');
    setTimeout(() => {
      navigate('/home');
    }, 800);
  }}
>
  <LogIn size={22} /> Entrar
</button>

            <button
              className="w-[50%] bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 rounded-lg flex items-center justify-center gap-2 text-lg shadow"
              onClick={() => showAlert('Receso activado.')}
            >
              <Coffee size={22} /> Receso
            </button>
            <button
              className="w-[50%] bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 text-lg shadow"
              onClick={() => showAlert('Token destruido. Usuario ha salido.')}
            >
              <LogOut size={22} /> Salir
            </button>
          </div>

        </div>
      </div>
      {/* Toast animation */}
      <style>
        {`
          @keyframes bounce-in {
            0% { transform: scale(0.8); opacity: 0; }
            60% { transform: scale(1.05); opacity: 1; }
            100% { transform: scale(1); }
          }
          .animate-bounce-in { animation: bounce-in 0.6s; }
        `}
      </style>
    </div>
  );
};

export default LoginPage;
