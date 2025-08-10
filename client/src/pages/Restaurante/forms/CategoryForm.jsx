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

    setNombre("");
    setDescripcion("");
    setMargen("");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6 text-white">
      {/* Formulario */}
      <div className="bg-[#1a2238] p-6 rounded-xl border border-yellow-500">
        <h2 className="text-xl font-bold text-yellow-300 mb-1 flex items-center gap-2">
          🗂️ Categorías
        </h2>
        <p className="text-sm text-slate-300 mb-4">Registra una nueva categoría del menú.</p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-sm text-slate-300 mb-1">
              Nombre de la categoría
            </label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej. Bebidas"
              required
              className="w-full px-4 py-2 bg-[#2c3e50] text-white rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm text-slate-300 mb-1">
              Descripción
            </label>
            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Describe el tipo de platos que incluye esta categoría"
              rows={2}
              required
              className="w-full px-4 py-2 bg-[#2c3e50] text-white rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm text-slate-300 mb-1">
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
              className="w-full px-4 py-2 bg-[#2c3e50] text-white rounded-md"
            />
          </div>

          <div className="pt-3">
            <button
              type="submit"
              className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-6 py-2 rounded-md"
            >
              Guardar categoría
            </button>
          </div>
        </form>
      </div>

      {/* Tabla */}
      <div className="bg-[#1a2238] p-6 rounded-xl border border-yellow-500 min-h-[400px] text-white">
        <h3 className="text-lg font-bold text-yellow-300 mb-2">
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
