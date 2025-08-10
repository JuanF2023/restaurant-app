import React, { useState } from "react";

const PreparacionForm = () => {
  const [proceso, setProceso] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [margen, setMargen] = useState("");
  const [configurado, setConfigurado] = useState(true);

  const [preparaciones, setPreparaciones] = useState([
    {
      id: "prep_1",
      proceso: "Producción",
      descripcion: "Preparación desde ingredientes básicos en cocina",
      margen: "50%",
      configurado: true,
    },
    {
      id: "prep_2",
      proceso: "Reventa",
      descripcion: "Producto comprado para reventa directa",
      margen: "20%",
      configurado: true,
    },
    {
      id: "prep_3",
      proceso: "Ensamblado",
      descripcion: "Montaje de componentes pre-elaborados",
      margen: "35%",
      configurado: true,
    },
    {
      id: "prep_4",
      proceso: "Combo",
      descripcion: "Combinación de múltiples productos",
      margen: "25%",
      configurado: true,
    },
  ]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const nuevaPreparacion = {
      id: `prep_${preparaciones.length + 1}`,
      proceso,
      descripcion,
      margen: `${margen}%`,
      configurado,
      creadoPor: "sistema",
      fechaCreacion: new Date().toISOString(),
    };

    setPreparaciones([...preparaciones, nuevaPreparacion]);
    setProceso("");
    setDescripcion("");
    setMargen("");
    setConfigurado(true);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6 text-white">
      {/* Formulario izquierda */}
      <div className="bg-[#1a2238] p-6 rounded-xl border border-yellow-500">
        <h2 className="text-xl font-bold text-yellow-300 mb-1 flex items-center gap-2">
          👨‍🍳 Tipos de Preparación
        </h2>
        <p className="text-sm text-slate-300 mb-4">Registra un nuevo tipo de preparación.</p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-sm text-slate-300 mb-1">Proceso</label>
            <input
              type="text"
              value={proceso}
              onChange={(e) => setProceso(e.target.value)}
              placeholder="Ej. Producción"
              required
              className="w-full px-4 py-2 bg-[#2c3e50] text-white rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm text-slate-300 mb-1">Descripción</label>
            <input
              type="text"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Describe el proceso"
              required
              className="w-full px-4 py-2 bg-[#2c3e50] text-white rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm text-slate-300 mb-1">Margen de ganancia sugerido (%)</label>
            <input
              type="number"
              step="1"
              min="0"
              value={margen}
              onChange={(e) => setMargen(e.target.value)}
              placeholder="Ej. 30"
              required
              className="w-full px-4 py-2 bg-[#2c3e50] text-white rounded-md"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={configurado}
              onChange={(e) => setConfigurado(e.target.checked)}
              className="accent-yellow-400"
            />
            <label className="text-sm text-slate-300">Configurado</label>
          </div>

          <div className="pt-3">
            <button
              type="submit"
              className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-6 py-2 rounded-md"
            >
              Guardar preparación
            </button>
          </div>
        </form>
      </div>

      {/* Tabla derecha */}
      <div className="bg-[#1a2238] p-6 rounded-xl border border-yellow-500 min-h-[400px] text-white overflow-auto">
        <h3 className="text-lg font-bold text-yellow-300 mb-2">Tipos registrados</h3>
        <table className="w-full text-sm text-left border-separate border-spacing-y-2">
          <thead>
            <tr className="text-yellow-200">
              <th>ID</th>
              <th>Proceso</th>
              <th>Descripción</th>
              <th>Margen</th>
              <th>Configurado</th>
            </tr>
          </thead>
          <tbody>
            {preparaciones.map((prep) => (
              <tr key={prep.id} className="text-white">
                <td>{prep.id}</td>
                <td>{prep.proceso}</td>
                <td>{prep.descripcion}</td>
                <td>{prep.margen}</td>
                <td>{prep.configurado ? "Sí" : "No"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PreparacionForm;
