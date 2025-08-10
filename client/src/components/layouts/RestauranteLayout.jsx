import React, { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import {
  Home,
  ListOrdered,
  ChefHat,
  FileBarChart,
  Settings,
  Menu,
  X,
} from 'lucide-react';

const RestauranteLayout = () => {
  const [menuAbierto, setMenuAbierto] = useState(false);

  const fecha = new Intl.DateTimeFormat('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
    .format(new Date())
    .toUpperCase();

    const navLinkClass = ({ isActive }) =>
      `flex items-center gap-2 px-4 py-2.5 rounded-lg text-base font-bold border-2 border-yellow-400 
       transition-all duration-200 ease-in-out
       ${isActive 
          ? 'bg-gradient-to-r from-blue-700 to-blue-600 text-white shadow-lg scale-105' 
          : 'bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:scale-105 hover:shadow-md'}
      `;
    

  const cerrarMenu = () => setMenuAbierto(false); // Función para cerrar el menú al hacer clic

  return (
    <div className="flex flex-col min-h-screen bg-slate-900">
      {/* NAVBAR SUPERIOR */}
      <header className="bg-slate-800 border-b border-yellow-400 px-4 py-3 md:px-6 flex flex-col md:flex-row md:items-center md:justify-between">
        {/* TÍTULO Y FECHA */}
        <div className="flex items-center justify-between md:justify-start w-full">
          <div>
            <h1 className="text-3xl font-bold text-yellow-400">Restaurante 01</h1>


            <p className="text-lg text-blue-200">Sucursal Chaparral · {fecha}</p>
          </div>

          {/* BOTÓN HAMBURGUESA */}
          <button
            onClick={() => setMenuAbierto(!menuAbierto)}
            className="md:hidden text-white p-2"
            aria-label="Abrir menú"
          >
            {menuAbierto ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* NAV ENLACES */}
        <nav
          className={`flex flex-col md:flex-row gap-2 mt-3 md:mt-0 transition-all duration-300 ${menuAbierto ? 'flex' : 'hidden md:flex'
            }`}
        >
          <NavLink to="/home" className={navLinkClass} onClick={cerrarMenu}>
            <Home size={20} /> Inicio
          </NavLink>
          <NavLink to="/ordenes" className={navLinkClass} onClick={cerrarMenu}>
            <ListOrdered size={20} /> Órdenes
          </NavLink>
          <NavLink to="/menu" className={navLinkClass} onClick={cerrarMenu}>
            <ChefHat size={20} /> Menú
          </NavLink>
          <NavLink to="/funciones" className={navLinkClass} onClick={cerrarMenu}>
            <Settings size={20} /> Funciones
          </NavLink>
          <NavLink to="/reportes" className={navLinkClass} onClick={cerrarMenu}>
            <FileBarChart size={20} /> Informes
          </NavLink>
        </nav>
      </header>

      {/* CONTENIDO PRINCIPAL */}
      <main className="flex-1 min-h-0 overflow-y-auto px-3 md:px-6 py-4 flex flex-col">

        <Outlet />
      </main>

{/* FOOTER FIJO SIEMPRE VISIBLE */}
<footer className="fixed bottom-0 inset-x-0 z-50 bg-black/85 backdrop-blur border-t border-yellow-500/70">
        <div className="max-w-screen-2xl mx-auto px-4 md:px-8 py-3 text-center text-slate-200 text-sm md:text-base">
          Restaurante 01 · <span className="text-white">Sucursal Chaparral</span> · Dispositivo <span className="text-yellow-400 font-semibold">#1</span> · <span className="text-yellow-400">v1.0.0</span>
        </div>
      </footer>
    </div>
  );
};

export default RestauranteLayout;