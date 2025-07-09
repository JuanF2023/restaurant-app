import React, { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import {
  Menu,
  Home,
  ListOrdered,
  Settings,
  FileBarChart,
} from 'lucide-react';

const MainLayout = () => {
  const [menuAbierto, setMenuAbierto] = useState(false);

  const fecha = new Intl.DateTimeFormat('es-ES', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(new Date()).replace(/([a-zñáéíóú])/i, match => match.toUpperCase());

  const navLinkClass = ({ isActive }) =>
    `w-[150px] flex items-center justify-center gap-2 text-center px-4 py-3 rounded-md text-xl font-bold border-2 border-yellow-400 bg-blue-600 text-white transition-all duration-300 ease-in-out transform ${
      isActive ? 'bg-blue-700 shadow-lg scale-105' : 'hover:bg-blue-500'
    }`;

  const handleNavClick = () => {
    if (window.innerWidth < 768) {
      setMenuAbierto(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-900 text-white transition-all duration-500 ease-in-out">
      {/* Encabezado y navegación */}
      <div className="p-6">
        <div className="flex justify-between items-start md:items-center flex-col md:flex-row mb-6 gap-4">
          <div>
            <h1 className="text-4xl font-bold">Restaurante 01</h1>
            <p className="text-xl text-blue-300">Juan Carlos</p>
          </div>

          {/* Botón hamburguesa solo en móviles */}
          <div className="md:hidden self-end">
            <button
              className="text-[#FACC15] hover:text-yellow-300 focus:outline-none"
              onClick={() => setMenuAbierto(!menuAbierto)}
              aria-label="Menú"
            >
              <Menu size={48} strokeWidth={2.5} />
            </button>
          </div>

          {/* Navegación */}
          <div
            className={`flex-col md:flex md:flex-row md:items-center md:gap-6 ${
              menuAbierto ? 'flex gap-4' : 'hidden'
            } md:gap-6 md:flex`}
          >
            <nav className="flex flex-col md:flex-row gap-2 md:gap-4 font-semibold">
              <NavLink to="/home" onClick={handleNavClick} className={navLinkClass}>
                <Home size={24} className="text-[#FACC15] translate-y-[1px]" />
                Inicio
              </NavLink>
              <NavLink to="/ordenes" onClick={handleNavClick} className={navLinkClass}>
                <ListOrdered size={24} className="text-[#FACC15] translate-y-[1px]" />
                Órdenes
              </NavLink>
              <NavLink to="/funciones" onClick={handleNavClick} className={navLinkClass}>
                <Settings size={26} className="text-[#FACC15] translate-y-[1px]" />
                Funciones
              </NavLink>
              <NavLink to="/reportes" onClick={handleNavClick} className={navLinkClass}>
                <FileBarChart size={24} className="text-[#FACC15] translate-y-[1px]" />
                Reportes
              </NavLink>
            </nav>
            <div className="flex flex-col md:flex-row md:items-center md:gap-4 gap-1 text-xl text-gray-400 md:ml-4">
              <span>{fecha}</span>
            </div>
          </div>
        </div>

        {/* Línea decorativa */}
        <div className="h-1 w-full bg-[#FACC15] rounded opacity-90 my-4 shadow-md" />
      </div>

      {/* Contenido dinámico */}
      <div className="flex-grow px-6">
        <Outlet />
      </div>

      {/* Footer */}
      <footer className="border-t border-yellow-500 text-sm text-gray-400 text-center py-2">
        Restaurante 01 – Sucursal 1 · Dispositivo #1 · v1.0.0
      </footer>
    </div>
  );
};

export default MainLayout;
