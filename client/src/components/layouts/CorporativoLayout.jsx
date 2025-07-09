// src/components/layouts/CorporativoLayout.jsx
import { Outlet, NavLink } from 'react-router-dom';
import { LogOut, Users, Settings, Building, BarChart3 } from 'lucide-react';

const CorporativoLayout = () => {
  const user = "Juan Carlos Flores"; // opcional: futuro uso de contexto

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Barra superior */}
      <header className="flex justify-between items-center px-6 py-4 border-b bg-white shadow-sm">
        <div className="text-xl font-bold text-blue-900">
          Inversiones JCF - Corporativo
        </div>
        <div className="flex items-center gap-6 text-sm">
          <span className="text-gray-700">Usuario: <strong>{user}</strong></span>
          <button className="text-red-600 hover:text-red-800 flex items-center gap-1">
            <LogOut size={18} />
            Cerrar sesión
          </button>
        </div>
      </header>

      {/* Menú de navegación */}
      <nav className="flex gap-4 px-6 py-3 border-b bg-gray-100 text-sm">
        <NavLink
          to="/corporativo/usuarios"
          className={({ isActive }) =>
            isActive ? "text-blue-700 font-semibold flex items-center gap-1" : "text-gray-700 hover:text-blue-700 flex items-center gap-1"
          }
        >
          <Users size={16} />
          Usuarios
        </NavLink>

        <NavLink
          to="/corporativo/parametros"
          className={({ isActive }) =>
            isActive ? "text-blue-700 font-semibold flex items-center gap-1" : "text-gray-700 hover:text-blue-700 flex items-center gap-1"
          }
        >
          <Settings size={16} />
          Parámetros
        </NavLink>

        <NavLink
          to="/corporativo/negocios"
          className={({ isActive }) =>
            isActive ? "text-blue-700 font-semibold flex items-center gap-1" : "text-gray-700 hover:text-blue-700 flex items-center gap-1"
          }
        >
          <Building size={16} />
          Negocios
        </NavLink>

        <NavLink
          to="/corporativo/reportes"
          className={({ isActive }) =>
            isActive ? "text-blue-700 font-semibold flex items-center gap-1" : "text-gray-700 hover:text-blue-700 flex items-center gap-1"
          }
        >
          <BarChart3 size={16} />
          Reportes
        </NavLink>
      </nav>

      {/* Contenido dinámico */}
      <main className="p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default CorporativoLayout;
