import React, { useState, useEffect } from "react";

const ComboForm = () => {
  const [nombreCombo, setNombreCombo] = useState("");
  const [categoria, setCategoria] = useState("");
  const [comentario, setComentario] = useState("");
  const [porcionesDisponibles, setPorcionesDisponibles] = useState([]);
  const [porcionesSeleccionadas, setPorcionesSeleccionadas] = useState([]);
  const [margenExtra, setMargenExtra] = useState(0.0);
  const [comboResumen, setComboResumen] = useState({ costo: 0, precio: 0 });

  const margenesPorTipo = {
    produccion: 0.45,
    reventa: 0.2,
    ensamblado: 0.35,
    combo: 0.25,
  };

  useEffect(() => {
    // Simulación de fetch desde backend
    setPorcionesDisponibles([
      { id: "por_1", nombre: "Papas fritas", costoBase: 1.5, tipoPreparacion: "produccion" },
      { id: "por_2", nombre: "Pollo frito", costoBase: 3.0, tipoPreparacion: "produccion" },
      { id: "por_3", nombre: "Soda 12oz", costoBase: 0.8, tipoPreparacion: "reventa" },
      { id: "por_4", nombre: "Hamburguesa", costoBase: 2.8, tipoPreparacion: "produccion" },
    ]);
  }, []);

  useEffect(() => {
    const seleccionadas = porcionesDisponibles.filter(p => porcionesSeleccionadas.includes(p.id));
    const costo = seleccionadas.reduce((acc, p) => acc + p.costoBase, 0);
    const margen = seleccionadas.reduce((acc, p) => acc + (p.costoBase * (margenesPorTipo[p.tipoPreparacion] || 0)), 0);
    const precio = costo + margen + parseFloat(margenExtra);
    setComboResumen({ costo, precio });
  }, [porcionesSeleccionadas, margenExtra, porcionesDisponibles]);

  const handleSeleccionPorcion = (id) => {
    setPorcionesSeleccionadas((prev) =>
      prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const nuevoCombo = {
      nombreCombo,
      categoria,
      porciones: porcionesSeleccionadas,
      comentario,
      margenExtra: parseFloat(margenExtra),
      creadoPor: "sistema",
      fechaCreacion: new Date().toISOString(),
    };

    console.log("Combo creado:", nuevoCombo);
    // Aquí se haría POST al backend
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
      {/* Formulario */}
      <div className="bg-[#0e1320] p-6 rounded-xl border border-yellow-400">
        <h2 className="text-2xl font-bold text-yellow-400 mb-2 flex items-center gap-2">
          🍻 Crear Combo
        </h2>
        <p className="text-white mb-3">Agrupa varias porciones en un solo platillo.</p>

        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Nombre */}
          <div>
            <label className="block text-sm font-semibold text-yellow-300 mb-1">
              Nombre del combo
            </label>
            <input
              type="text"
              placeholder="Ej. Combo pollo y soda"
              value={nombreCombo}
              onChange={(e) => setNombreCombo(e.target.value)}
              className="w-full px-4 py-1.5 bg-green-100 text-black rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
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
              className="w-full px-4 py-1.5 bg-green-100 text-black rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
            >
              <option value="" disabled hidden>
                Seleccione categoría
              </option>
              <option value="comida">Comida Casera</option>
              <option value="hamburguesa">Hamburguesas</option>
              <option value="pollo">Pollo Frito y Asado</option>
            </select>
          </div>

          {/* Selección de porciones */}
          <div>
            <label className="block text-sm font-semibold text-yellow-300 mb-1">
              Seleccione porciones
            </label>
            <div className="flex flex-wrap gap-2">
              {porcionesDisponibles.map((p) => (
                <label
                  key={p.id}
                  className={`px-3 py-1.5 rounded-md text-sm cursor-pointer ${
                    porcionesSeleccionadas.includes(p.id)
                      ? "bg-yellow-400 text-black font-semibold"
                      : "bg-green-100 text-black"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={porcionesSeleccionadas.includes(p.id)}
                    onChange={() => handleSeleccionPorcion(p.id)}
                    className="hidden"
                  />
                  {p.nombre}
                </label>
              ))}
            </div>
          </div>

          {/* Margen adicional */}
          <div>
            <label className="block text-sm font-semibold text-yellow-300 mb-1">
              Incremento extra al margen ($)
            </label>
            <input
              type="number"
              step="0.01"
              value={margenExtra}
              onChange={(e) => setMargenExtra(e.target.value)}
              className="w-full px-4 py-1.5 bg-green-100 text-black rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>

          {/* Comentario */}
          <div>
            <label className="block text-sm font-semibold text-yellow-300 mb-1">
              Comentario (opcional)
            </label>
            <textarea
              value={comentario}
              onChange={(e) => setComentario(e.target.value)}
              placeholder="Ej. Incluye bebida y papas"
              className="w-full px-4 py-1.5 bg-green-100 text-black rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>

          {/* Costo total y precio */}
          <div className="text-white text-sm">
            <p><strong>Costo total:</strong> ${comboResumen.costo.toFixed(2)}</p>
            <p><strong>Precio sugerido:</strong> ${comboResumen.precio.toFixed(2)}</p>
          </div>

          {/* Botón */}
          <div className="pt-3">
            <button
              type="submit"
              className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-6 py-1.5 rounded-md transition duration-200"
            >
              Guardar combo
            </button>
          </div>
        </form>
      </div>

      {/* Tabla derecha (placeholder) */}
      <div className="bg-[#0e1320] p-6 rounded-xl border border-yellow-400 text-white min-h-[400px]">
        <h3 className="text-xl font-bold text-yellow-300 mb-2">Combos registrados</h3>
        <p className="text-sm">Aquí aparecerán los combos guardados.</p>
      </div>
    </div>
  );
};

export default ComboForm;
