import React, { useState } from "react";

const UnidadForm = () => {
  const [nombre, setNombre] = useState("");

  const [unidades, setUnidades] = useState([
    { id: "med_1", nombre: "oz" },
    { id: "med_2", nombre: "piezas" },
    { id: "med_3", nombre: "rodajas" },
    { id: "med_4", nombre: "unidades" },
  ]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const nuevaUnidad = {
      id: `med_${unidades.length + 1}`,
      nombre,
      creadoPor: "sistema", // sustituir luego con usuario real
      fechaCreacion: new Date().toISOString(),
    };

    setUnidades([...unidades, nuevaUnidad]);
    setNombre("");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
      {/* Formulario izquierda */}
      <div className="bg-[#0e1320] p-6 rounded-xl shadow-md border border-yellow-400">
        <h2 className="text-2xl font-bold text-yellow-400 mb-2 flex items-center gap-2">
          ⚖️ Unidades de Medida
        </h2>
        <p className="text-white mb-3">Registra una nueva unidad.</p>

        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Nombre */}
          <div>
            <label className="block text-sm font-semibold text-yellow-300 mb-1">
              Nombre de la unidad
            </label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej. gramos, ml, porciones"
              required
              className="w-full px-4 py-1.5 bg-green-100 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>

          {/* Botón */}
          <div className="pt-3">
            <button
              type="submit"
              className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-6 py-1.5 rounded-md transition duration-200"
            >
              Guardar unidad
            </button>
          </div>
        </form>
      </div>

      {/* Tabla derecha */}
      <div className="bg-[#0e1320] p-6 rounded-xl border border-yellow-400 min-h-[400px] text-white overflow-auto">
        <h3 className="text-xl font-bold text-yellow-300 mb-2">
          Unidades registradas
        </h3>
        <table className="w-full text-sm text-left border-separate border-spacing-y-2">
          <thead>
            <tr className="text-yellow-200">
              <th>ID</th>
              <th>Nombre</th>
            </tr>
          </thead>
          <tbody>
            {unidades.map((unidad) => (
              <tr key={unidad.id} className="text-white">
                <td>{unidad.id}</td>
                <td>{unidad.nombre}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UnidadForm;
