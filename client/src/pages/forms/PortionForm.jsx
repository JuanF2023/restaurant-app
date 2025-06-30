import React, { useState } from "react";

const PortionForm = () => {
  const [nombre, setNombre] = useState("");
  const [categoria, setCategoria] = useState("");
  const [tamano, setTamano] = useState("");
  const [unidad, setUnidad] = useState("");
  const [costo, setCosto] = useState("");
  const [precio, setPrecio] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const nuevaPorcion = {
      nombre,
      categoria,
      tamano: parseFloat(tamano),
      unidad,
      costo: parseFloat(costo),
      precio: parseFloat(precio),
      creadoPor: "sistema", // Reemplaza con usuario real más adelante
      fechaCreacion: new Date().toISOString(),
    };

    console.log("Porción registrada:", nuevaPorcion);

    // Reinicia el formulario
    setNombre("");
    setCategoria("");
    setTamano("");
    setUnidad("");
    setCosto("");
    setPrecio("");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
      {/* Columna izquierda - Formulario */}
      <div className="bg-[#0e1320] p-6 rounded-xl shadow-md border border-yellow-400">
        <h2 className="text-2xl font-bold text-yellow-400 mb-2 flex items-center gap-2">
          🍽️ Porciones
        </h2>

        <p className="text-white mb-3">
          Registra aquí una nueva porción para el menú.
        </p>

        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Nombre de la porción */}
          <div>
            <label className="block text-sm font-semibold text-yellow-300 mb-1">
              Nombre de la porción
            </label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej. Papas fritas"
              className="w-full px-4 py-1.5 bg-green-100 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 text-black"
              required
            />
          </div>

          {/* Categoría */}
          <div>
            <label className="block text-sm font-semibold text-yellow-300 mb-1">
              Categoría
            </label>
            <select
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              className="w-full px-4 py-1.5 bg-green-100 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 text-black"
              required
            >
              <option value="" disabled hidden>
                Seleccione categoría
              </option>
              <option value="entrada">Entrada</option>
              <option value="principal">Plato principal</option>
              <option value="postre">Postre</option>
              <option value="bebida">Bebida</option>
            </select>
          </div>

          {/* Tamaño y Unidad de Medida */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-yellow-300 mb-1">
                Tamaño
              </label>
              <input
                type="number"
                step="0.1"
                value={tamano}
                onChange={(e) => setTamano(e.target.value)}
                placeholder="Ej. 4"
                className="w-full px-4 py-1.5 bg-green-100 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 text-black"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-yellow-300 mb-1">
                Unidad de medida
              </label>
              <select
                value={unidad}
                onChange={(e) => setUnidad(e.target.value)}
                className="w-full px-4 py-1.5 bg-green-100 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 text-black"
                required
              >
                <option value="" disabled hidden>
                  Seleccione unidad
                </option>
                <option value="oz">oz</option>
                <option value="piezas">piezas</option>
                <option value="rodajas">rodajas</option>
                <option value="unidades">unidades</option>
              </select>
            </div>
          </div>

          {/* Costo y Precio */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-yellow-300 mb-1">
                Costo base ($)
              </label>
              <input
                type="number"
                step="0.01"
                value={costo}
                onChange={(e) => setCosto(e.target.value)}
                placeholder="Ej. 2.50"
                className="w-full px-4 py-1.5 bg-green-100 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 text-black"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-yellow-300 mb-1">
                Precio de venta sugerido ($)
              </label>
              <input
                type="number"
                step="0.01"
                value={precio}
                onChange={(e) => setPrecio(e.target.value)}
                placeholder="Ej. 4.00"
                className="w-full px-4 py-1.5 bg-green-100 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 text-black"
                required
              />
            </div>
          </div>

          {/* Margen de ganancia (estimado) */}
          <div>
            <label className="block text-sm font-semibold text-yellow-300 mb-1">
              Margen estimado (%)
            </label>
            <input
              type="text"
              readOnly
              value={
                costo && precio
                  ? `${Math.round(((precio - costo) / costo) * 100)}%`
                  : "Calculado automáticamente"
              }
              className="w-full px-4 py-1.5 bg-gray-200 text-gray-600 rounded-md cursor-not-allowed"
            />
          </div>

          {/* Botón */}
          <div className="pt-3">
            <button
              type="submit"
              className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-6 py-1.5 rounded-md transition duration-200"
            >
              Guardar porción
            </button>
          </div>
        </form>
      </div>

      {/* Columna derecha - Datos de la BD */}
      <div className="bg-[#0e1320] p-6 rounded-xl border border-yellow-400 min-h-[400px] text-white">
        <h3 className="text-xl font-bold text-yellow-300 mb-2">
          Porciones registradas
        </h3>
        <p className="text-sm">Aquí aparecerán las porciones que ya existen en el sistema.</p>
      </div>
    </div>
  );
};

export default PortionForm;
