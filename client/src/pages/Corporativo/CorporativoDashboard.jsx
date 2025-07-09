// src/pages/Corporativo/CorporativoDashboard.jsx
import React from 'react';
import {
  Building2,
  Users,
  Wrench,
  CheckCircle,
  BarChart3,
} from 'lucide-react';

export default function CorporativoDashboard() {
  // Datos simulados (más adelante se conectará a MongoDB)
  const resumen = {
    negociosTotales: 5,
    negociosActivos: 3,
    negociosConstruccion: 2,
    usuariosCorporativos: 8,
  };

  const tarjetas = [
    {
      icono: <Building2 size={28} />, label: 'Negocios totales', valor: resumen.negociosTotales, color: 'text-blue-600'
    },
    {
      icono: <CheckCircle size={28} />, label: 'Activos', valor: resumen.negociosActivos, color: 'text-green-600'
    },
    {
      icono: <Wrench size={28} />, label: 'En construcción', valor: resumen.negociosConstruccion, color: 'text-yellow-600'
    },
    {
      icono: <Users size={28} />, label: 'Usuarios corporativos', valor: resumen.usuariosCorporativos, color: 'text-purple-600'
    },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Panel Corporativo</h2>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {tarjetas.map((t, i) => (
          <div
            key={i}
            className="bg-white border rounded-xl shadow-sm p-5 flex flex-col items-start gap-2 hover:shadow-md transition"
          >
            <div className={`flex items-center gap-2 ${t.color}`}>{t.icono}<span className="font-semibold">{t.label}</span></div>
            <div className="text-3xl font-bold text-gray-800">{t.valor}</div>
          </div>
        ))}
      </div>

      <div className="mt-10">
        <h3 className="text-lg font-semibold mb-2 text-gray-700">Bienvenido al sistema corporativo</h3>
        <p className="text-sm text-gray-600">
          Desde aquí puedes monitorear el estado global de tus negocios, administrar usuarios corporativos,
          visualizar reportes y configurar los parámetros generales. Usa el menú superior para navegar.
        </p>
      </div>
    </div>
  );
}
