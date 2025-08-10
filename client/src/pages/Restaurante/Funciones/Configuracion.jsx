import React, { useState } from 'react';

const Configuracion = () => {
  const [form, setForm] = useState({
    nombre: 'Restaurante 01',
    sucursal: 'Chaparral',
    direccion:
      'Polígono 33B, Calle Nacional # 28, Cantón El Capulín, Colón, La Libertad',
    mesas: 6,
    idioma: 'Español',
    zonaHoraria: 'America/El_Salvador',
    apertura: '08:00 AM',
    cierre: '09:00 PM',
    margenGanancia: 30,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const historial = [
    {
      fecha: '2025-07-20 09:12 AM',
      campo: 'Horario de cierre',
      anterior: '08:00 PM',
      nuevo: '09:00 PM',
    },
    {
      fecha: '2025-07-18 05:31 PM',
      campo: 'Número de mesas',
      anterior: '5',
      nuevo: '6',
    },
    {
      fecha: '2025-07-10 10:45 AM',
      campo: 'Margen de ganancia',
      anterior: '25%',
      nuevo: '30%',
    },
  ];

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Panel izquierdo */}
        <div className="bg-gradient-to-r from-slate-800 to-slate-700 border border-yellow-400 rounded-xl p-6 shadow text-white">
          <h2 className="text-xl font-bold mb-2 flex items-center gap-2 text-yellow-300">
            <span className="text-2xl">🧾</span> Parámetros del Restaurante
          </h2>
          <p className="text-sm text-slate-300 mb-6">
            Visualiza o modifica la configuración general del sistema.
          </p>

          <div className="space-y-3">
            <div>
              <label className="block text-sm mb-1">Nombre del restaurante</label>
              <input
                type="text"
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
                className="w-full rounded-md bg-slate-900 border border-slate-600 text-white px-3 py-2 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                disabled
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Sucursal</label>
              <input
                type="text"
                name="sucursal"
                value={form.sucursal}
                onChange={handleChange}
                className="w-full rounded-md bg-slate-900 border border-slate-600 text-white px-3 py-2 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                disabled
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Dirección</label>
              <input
                type="text"
                name="direccion"
                value={form.direccion}
                onChange={handleChange}
                className="w-full rounded-md bg-slate-900 border border-slate-600 text-white px-3 py-2 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                disabled
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Número de mesas</label>
              <input
                type="number"
                name="mesas"
                value={form.mesas}
                onChange={handleChange}
                className="w-full rounded-md bg-slate-900 border border-slate-600 text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                disabled
              />
            </div>

            <div className="flex gap-4">
              <div className="w-1/2">
                <label className="block text-sm mb-1">Idioma</label>
                <select
                  name="idioma"
                  value={form.idioma}
                  onChange={handleChange}
                  className="w-full rounded-md bg-slate-900 border border-slate-600 text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  disabled
                >
                  <option value="Español">Español</option>
                </select>
              </div>

              <div className="w-1/2">
                <label className="block text-sm mb-1">Zona horaria</label>
                <select
                  name="zonaHoraria"
                  value={form.zonaHoraria}
                  onChange={handleChange}
                  className="w-full rounded-md bg-slate-900 border border-slate-600 text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  disabled
                >
                  <option value="America/El_Salvador">America/El_Salvador</option>
                </select>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-1/2">
                <label className="block text-sm mb-1">Horario de apertura</label>
                <input
                  type="text"
                  name="apertura"
                  value={form.apertura}
                  onChange={handleChange}
                  className="w-full rounded-md bg-slate-900 border border-slate-600 text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  disabled
                />
              </div>

              <div className="w-1/2">
                <label className="block text-sm mb-1">Horario de cierre</label>
                <input
                  type="text"
                  name="cierre"
                  value={form.cierre}
                  onChange={handleChange}
                  className="w-full rounded-md bg-slate-900 border border-slate-600 text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  disabled
                />
              </div>
            </div>

            <div>
              <label className="block text-sm mb-1">Margen de ganancia general (%)</label>
              <input
                type="number"
                name="margenGanancia"
                value={form.margenGanancia}
                onChange={handleChange}
                className="w-full rounded-md bg-slate-900 border border-slate-600 text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                disabled
              />
            </div>

            <button className="mt-4 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-4 py-2 rounded transition-all">
              Modificar parámetros
            </button>
          </div>
        </div>

        {/* Panel derecho - Historial */}
        <div className="bg-gradient-to-r from-slate-800 to-slate-700 border border-yellow-400 rounded-xl p-6 text-white">
          <h3 className="text-lg font-semibold text-yellow-300 mb-2">
            Historial de modificaciones
          </h3>
          {historial.length === 0 ? (
            <p className="text-slate-400 text-sm">No hay registros recientes.</p>
          ) : (
            <ul className="divide-y divide-slate-700 text-sm max-h-[400px] overflow-y-auto custom-scrollbar">
              {historial.map((item, index) => (
                <li key={index} className="py-2">
                  <p className="text-yellow-200 font-medium">{item.campo}</p>
                  <p className="text-slate-300">
                    <span className="text-slate-400">Anterior:</span> {item.anterior}
                  </p>
                  <p className="text-slate-300">
                    <span className="text-slate-400">Nuevo:</span> {item.nuevo}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">{item.fecha}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Configuracion;
