import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  UserCog,
  Clock,
  Settings,
  Salad,
  Percent,
  Globe
} from 'lucide-react';

const funciones = [
  {
    titulo: 'Usuarios y roles',
    descripcion: 'Gestiona meseros, cocineros y gerentes',
    icono: <UserCog size={36} className="text-black" />,
    ruta: '/settings/usuarios' // ✅ CORREGIDO
  },
  {
    titulo: 'Turnos y entradas',
    descripcion: 'Controla registros de entrada y salida',
    icono: <Clock size={36} className="text-black" />,
    ruta: '/settings/turnos' // ✅ CORREGIDO
  },
  {
    titulo: 'Configuración restaurante',
    descripcion: 'Nombre, sucursal, número de mesas',
    icono: <Settings size={36} className="text-black" />,
    ruta: '/settings/configuracion' // ✅ CORREGIDO
  },
  {
    titulo: 'Gestión de menú',
    descripcion: 'Platos, porciones, categorías y precios',
    icono: <Salad size={36} className="text-black" />,
    ruta: '/menu' // Esta ya estaba correcta
  },
  {
    titulo: 'Propinas e impuestos',
    descripcion: 'Define cargos automáticos por servicio',
    icono: <Percent size={36} className="text-black" />,
    ruta: '/settings/impuestos' // ✅ CORREGIDO
  },
  {
    titulo: 'Parámetros generales',
    descripcion: 'Idioma, zona horaria, horario de atención',
    icono: <Globe size={36} className="text-black" />,
    ruta: '/settings/parametros' // ✅ CORREGIDO
  }
];

const Funciones = () => {
  const navigate = useNavigate();

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-white">Funciones del Restaurante</h1>

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {funciones.map((f, i) => (
          <div
            key={i}
            onClick={() => navigate(f.ruta)}
            className="bg-green-600 text-white p-5 rounded-xl border border-white shadow hover:bg-green-700 hover:scale-[1.01] transition-all cursor-pointer"
          >
            <div className="flex items-center gap-4 mb-3">
              <div className="bg-white p-2 rounded-lg">{f.icono}</div>
              <h2 className="text-xl font-semibold">{f.titulo}</h2>
            </div>
            <p className="text-sm opacity-90">{f.descripcion}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Funciones;
