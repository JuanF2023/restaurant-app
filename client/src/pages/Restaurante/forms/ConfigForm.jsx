import React, { useState } from "react";

const ConfigForm = () => {
  const [nombre, setNombre] = useState("Restaurante 01");
  const [sucursal, setSucursal] = useState("Sucursal Central");
  const [mesas, setMesas] = useState(10);
  const [moneda, setMoneda] = useState("USD");
  const [formatoHora, setFormatoHora] = useState("24h");
  const [tiempoEspera, setTiempoEspera] = useState(15);
  const [mostrarImpuestos, setMostrarImpuestos] = useState(true);
  const [editarOrdenes, setEditarOrdenes] = useState(true);

  const [configActual, setConfigActual] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    const nuevaConfig = {
      nombre,
      sucursal,
      mesas,
      moneda,
      formatoHora,
      tiempoEspera,
      mostrarImpuestos,
      editarOrdenes,
      creadoPor: "sistema",
      fechaCreacion: new Date().toISOString(),
    };

    setConfigActual(nuevaConfig);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
      {/* Formulario de configuración */}
      <div className="bg-[#0e1320] p-4 rounded-xl shadow-md border border-yellow-400">
        <h2 className="text-2xl font-bold text-yellow-400 mb-2 flex items-center gap-2">
          ⚙️ Configuración del Restaurante
        </h2>
        <p className="text-white mb-2">Establece los parámetros generales del sistema.</p>

        <form onSubmit={handleSubmit} className="space-y-2">
          {/* Nombre */}
          <div>
            <label className="block text-sm font-semibold text-yellow-300 mb-1">
              Nombre del restaurante
            </label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full px-4 py-1 bg-green-100 text-black rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
              required
            />
          </div>

          {/* Sucursal */}
          <div>
            <label className="block text-sm font-semibold text-yellow-300 mb-1">
              Sucursal
            </label>
            <input
              type="text"
              value={sucursal}
              onChange={(e) => setSucursal(e.target.value)}
              className="w-full px-4 py-1 bg-green-100 text-black rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
              required
            />
          </div>

          {/* Mesas */}
          <div>
            <label className="block text-sm font-semibold text-yellow-300 mb-1">
              Número total de mesas
            </label>
            <input
              type="number"
              min={1}
              value={mesas}
              onChange={(e) => setMesas(e.target.value)}
              className="w-full px-4 py-1 bg-green-100 text-black rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
              required
            />
          </div>

          {/* Moneda */}
          <div>
            <label className="block text-sm font-semibold text-yellow-300 mb-1">
              Moneda
            </label>
            <select
              value={moneda}
              onChange={(e) => setMoneda(e.target.value)}
              className="w-full px-4 py-1 bg-green-100 text-black rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="MXN">MXN ($)</option>
            </select>
          </div>

          {/* Formato hora */}
          <div>
            <label className="block text-sm font-semibold text-yellow-300 mb-1">
              Formato de hora
            </label>
            <select
              value={formatoHora}
              onChange={(e) => setFormatoHora(e.target.value)}
              className="w-full px-4 py-1 bg-green-100 text-black rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
            >
              <option value="12h">12 horas</option>
              <option value="24h">24 horas</option>
            </select>
          </div>

          {/* Tiempo de espera */}
          <div>
            <label className="block text-sm font-semibold text-yellow-300 mb-1">
              Tiempo promedio de espera (minutos)
            </label>
            <input
              type="number"
              min={1}
              value={tiempoEspera}
              onChange={(e) => setTiempoEspera(e.target.value)}
              className="w-full px-4 py-1 bg-green-100 text-black rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>

          {/* Switches */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={mostrarImpuestos}
              onChange={(e) => setMostrarImpuestos(e.target.checked)}
              className="accent-yellow-400"
            />
            <label className="text-sm font-semibold text-yellow-300">
              Mostrar precios con impuestos
            </label>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={editarOrdenes}
              onChange={(e) => setEditarOrdenes(e.target.checked)}
              className="accent-yellow-400"
            />
            <label className="text-sm font-semibold text-yellow-300">
              Permitir edición de órdenes
            </label>
          </div>

          {/* Botón */}
          <div className="pt-2">
            <button
              type="submit"
              className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-6 py-1 rounded-md transition duration-200"
            >
              Guardar configuración
            </button>
          </div>
        </form>
      </div>

      {/* Panel de vista previa */}
      <div className="bg-[#0e1320] p-4 rounded-xl border border-yellow-400 text-white">
        <h3 className="text-xl font-bold text-yellow-300 mb-2">
          Configuración actual
        </h3>
        {configActual ? (
          <ul className="text-sm space-y-1">
            <li><strong>Restaurante:</strong> {configActual.nombre}</li>
            <li><strong>Sucursal:</strong> {configActual.sucursal}</li>
            <li><strong>Mesas:</strong> {configActual.mesas}</li>
            <li><strong>Moneda:</strong> {configActual.moneda}</li>
            <li><strong>Formato de hora:</strong> {configActual.formatoHora}</li>
            <li><strong>Espera promedio:</strong> {configActual.tiempoEspera} min</li>
            <li><strong>Mostrar impuestos:</strong> {configActual.mostrarImpuestos ? "Sí" : "No"}</li>
            <li><strong>Editar órdenes:</strong> {configActual.editarOrdenes ? "Sí" : "No"}</li>
          </ul>
        ) : (
          <p className="text-sm text-white">Aún no se ha configurado.</p>
        )}
      </div>
    </div>
  );
};

export default ConfigForm;
