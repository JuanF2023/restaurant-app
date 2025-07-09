import React, { useState } from "react";

const CategoriaForm = () => {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [margen, setMargen] = useState("");

  const [categorias, setCategorias] = useState([
    {
      id: "cat_1",
      nombre: "Bebidas",
      descripcion: "Jugos, refrescos, cafés",
      margen: "55%",
    },
    {
      id: "cat_2",
      nombre: "Comida Casera",
      descripcion: "Guisos, sopas, comida del hogar",
      margen: "40%",
    },
    {
      id: "cat_3",
      nombre: "Menú Infantil",
      descripcion: "Comidas para niños",
      margen: "60%",
    },
  ]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const nuevaCategoria = {
      id: `cat_${categorias.length + 1}`,
      nombre,
      descripcion,
      margen: `${margen}%`,
      creadoPor: "sistema",
      fechaCreacion: new Date().toISOString(),
    };

    setCategorias([...categorias, nuevaCategoria]);

    // Reiniciar formulario
    setNombre("");
    setDescripcion("");
    setMargen("");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
      {/* Formulario */}
      <div className="bg-[#0e1320] p-6 rounded-xl shadow-md border border-yellow-400">
        <h2 className="text-2xl font-bold text-yellow-400 mb-2 flex items-center gap-2">
          🗂️ Categorías
        </h2>
        <p className="text-white mb-3">Registra una nueva categoría del menú.</p>

        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Nombre */}
          <div>
            <label className="block text-sm font-semibold text-yellow-300 mb-1">
              Nombre de la categoría
            </label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej. Bebidas"
              required
              className="w-full px-4 py-1.5 bg-green-100 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-sm font-semibold text-yellow-300 mb-1">
              Descripción
            </label>
            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Describe el tipo de platos que incluye esta categoría"
              rows={2}
              required
              className="w-full px-4 py-1.5 bg-green-100 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>

          {/* Margen sugerido */}
          <div>
            <label className="block text-sm font-semibold text-yellow-300 mb-1">
              Margen de ganancia sugerido (%)
            </label>
            <input
              type="number"
              step="1"
              min="0"
              value={margen}
              onChange={(e) => setMargen(e.target.value)}
              placeholder="Ej. 40"
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
              Guardar categoría
            </button>
          </div>
        </form>
      </div>

      {/* Tabla */}
      <div className="bg-[#0e1320] p-6 rounded-xl border border-yellow-400 min-h-[400px] text-white overflow-auto">
        <h3 className="text-xl font-bold text-yellow-300 mb-2">
          Categorías registradas
        </h3>
        <table className="w-full text-sm text-left border-separate border-spacing-y-2">
          <thead>
            <tr className="text-yellow-200">
              <th>ID</th>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Margen</th>
            </tr>
          </thead>
          <tbody>
            {categorias.map((cat) => (
              <tr key={cat.id} className="text-white">
                <td>{cat.id}</td>
                <td>{cat.nombre}</td>
                <td>{cat.descripcion}</td>
                <td>{cat.margen}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CategoriaForm;
