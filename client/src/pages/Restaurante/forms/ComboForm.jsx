// ComboForm.jsx actualizado con validaciones, resumen y botón cancelar
import React, { useState, useEffect } from "react";
import { Plus, Minus, Trash2 } from "lucide-react";

const ComboForm = () => {
  const [nombreCombo, setNombreCombo] = useState("");
  const [categoria, setCategoria] = useState("");
  const [comentario, setComentario] = useState("");
  const [etiquetas, setEtiquetas] = useState("");
  const [imagen, setImagen] = useState(null);
  const [preview, setPreview] = useState(null);
  const [confirmado, setConfirmado] = useState(false);
  const [precioVenta, setPrecioVenta] = useState("");

  const [porcionesDisponibles, setPorcionesDisponibles] = useState([]);
  const [porcionesSeleccionadas, setPorcionesSeleccionadas] = useState([]);
  const [combosGuardados, setCombosGuardados] = useState([]);
  const [busquedaCombo, setBusquedaCombo] = useState("");

  useEffect(() => {
    setPorcionesDisponibles([
      { id: "por_1", nombre: "Papas fritas", costoBase: 1.5, tipoPreparacion: "produccion" },
      { id: "por_2", nombre: "Pollo frito", costoBase: 3.0, tipoPreparacion: "produccion" },
      { id: "por_3", nombre: "Soda 12oz", costoBase: 0.8, tipoPreparacion: "reventa" },
      { id: "por_4", nombre: "Hamburguesa", costoBase: 2.8, tipoPreparacion: "produccion" },
    ]);
  }, []);

  const margenesPorTipo = {
    produccion: 0.45,
    reventa: 0.2,
    ensamblado: 0.35,
    combo: 0.25,
  };

  const calcularResumen = () => {
    const seleccionadas = porcionesSeleccionadas.map((item) => {
      const porcion = porcionesDisponibles.find((p) => p.id === item.id);
      return { ...porcion, cantidad: item.cantidad };
    });

    const costo = seleccionadas.reduce((acc, p) => acc + p.costoBase * p.cantidad, 0);
    const margen = seleccionadas.reduce(
      (acc, p) => acc + p.costoBase * (margenesPorTipo[p.tipoPreparacion] || 0) * p.cantidad,
      0
    );

    const precioSugerido = (costo + margen).toFixed(2);
    const margenTotal = precioVenta && costo ? (((precioVenta - costo) / costo) * 100).toFixed(2) : 0;

    return { costo: costo.toFixed(2), precioSugerido, margenTotal };
  };

  const resumen = calcularResumen();
  const formularioLleno = nombreCombo && categoria && porcionesSeleccionadas.length > 0 && precioVenta;

  const agregarPorcion = (id) => {
    setPorcionesSeleccionadas((prev) => {
      const existente = prev.find((p) => p.id === id);
      if (existente) {
        return prev.map((p) => (p.id === id ? { ...p, cantidad: p.cantidad + 1 } : p));
      }
      return [...prev, { id, cantidad: 1 }];
    });
  };

  const quitarPorcion = (id) => {
    setPorcionesSeleccionadas((prev) =>
      prev.map((p) => (p.id === id ? { ...p, cantidad: Math.max(1, p.cantidad - 1) } : p))
    );
  };

  const eliminarPorcion = (id) => {
    setPorcionesSeleccionadas((prev) => prev.filter((p) => p.id !== id));
  };

  const resetFormulario = () => {
    setNombreCombo("");
    setCategoria("");
    setComentario("");
    setEtiquetas("");
    setImagen(null);
    setPreview(null);
    setPrecioVenta("");
    setPorcionesSeleccionadas([]);
    setConfirmado(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!confirmado || !formularioLleno) return;

    const nuevoCombo = {
      tipoVenta: "combo",
      nombre: nombreCombo,
      categoria,
      comentario,
      etiquetas: etiquetas.split(",").map((tag) => tag.trim()),
      porcionesIncluidas: porcionesSeleccionadas,
      precioVenta: parseFloat(precioVenta),
      costoTotal: parseFloat(resumen.costo),
      margenTotal: parseFloat(resumen.margenTotal),
      foto: preview,
      creadoPor: "sistema",
      fechaCreacion: new Date().toISOString(),
    };

    setCombosGuardados([nuevoCombo, ...combosGuardados]);
    resetFormulario();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
      <div className="bg-[#0e1320] p-6 rounded-xl border border-yellow-400 text-white">
        <h2 className="text-2xl font-bold text-yellow-400 mb-2">🍻 Crear Combo</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input type="text" value={nombreCombo} onChange={(e) => setNombreCombo(e.target.value)} placeholder="Nombre del combo" className="w-full px-4 py-1.5 bg-green-100 rounded-md text-black" required />

          <select value={categoria} onChange={(e) => setCategoria(e.target.value)} className="w-full px-4 py-1.5 bg-green-100 rounded-md text-black" required>
            <option value="" disabled hidden>Seleccione categoría</option>
            <option value="comida">Comida Casera</option>
            <option value="hamburguesa">Hamburguesas</option>
            <option value="pollo">Pollo Frito y Asado</option>
          </select>

          <input type="text" value={etiquetas} onChange={(e) => setEtiquetas(e.target.value)} placeholder="Etiquetas (separadas por coma)" className="w-full px-4 py-1.5 bg-green-100 rounded-md text-black" />

          <textarea value={comentario} onChange={(e) => setComentario(e.target.value)} placeholder="Comentario (opcional)" className="w-full px-4 py-1.5 bg-green-100 text-black rounded-md" />

          <div>
            <label className="block text-yellow-300 font-semibold mb-1">Selecciona porciones</label>
            <div className="grid grid-cols-2 gap-2">
              {porcionesDisponibles.map((p) => (
                <button key={p.id} type="button" onClick={() => agregarPorcion(p.id)} className="bg-green-100 text-black py-1 px-3 rounded hover:bg-yellow-300">
                  {p.nombre}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-yellow-300 font-semibold mb-1">Porciones seleccionadas</label>
            {porcionesSeleccionadas.map((p) => {
              const info = porcionesDisponibles.find((x) => x.id === p.id);
              return (
                <div key={p.id} className="flex items-center justify-between bg-white text-black px-3 py-1 rounded mb-1">
                  <span>{info?.nombre} × {p.cantidad}</span>
                  <div className="flex gap-2">
                    <button type="button" onClick={() => quitarPorcion(p.id)}><Minus size={16} /></button>
                    <button type="button" onClick={() => agregarPorcion(p.id)}><Plus size={16} /></button>
                    <button type="button" onClick={() => eliminarPorcion(p.id)}><Trash2 size={16} /></button>
                  </div>
                </div>
              );
            })}
          </div>

          <input type="text" value={`Costo actual: $${resumen.costo}`} readOnly className="w-full px-4 py-1.5 bg-gray-200 text-gray-600 rounded-md" />
          <input type="text" value={`Precio sugerido: $${resumen.precioSugerido}`} readOnly className="w-full px-4 py-1.5 bg-gray-200 text-gray-600 rounded-md" />
          <input type="number" value={precioVenta} onChange={(e) => setPrecioVenta(e.target.value)} placeholder="Establecer precio de venta" className={`w-full px-4 py-1.5 rounded-md ${precioVenta < resumen.costo ? "bg-red-100 text-red-600" : "bg-green-100 text-black"}`} required />

          <input type="file" accept="image/*" onChange={(e) => {
            const file = e.target.files[0];
            setImagen(file);
            setPreview(URL.createObjectURL(file));
          }} className="block w-full text-sm text-white file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:font-semibold file:bg-yellow-300 file:text-black hover:file:bg-yellow-400" />
          {preview && <img src={preview} alt="Vista previa" className="mt-2 rounded-md w-24 h-24 object-cover border" />}

          {!confirmado && formularioLleno && (
  <div className="bg-yellow-100 border border-yellow-400 p-3 rounded-md text-yellow-800 text-sm">
    <p className="font-bold mb-1">⚠️ Resumen</p>
    {precioVenta < resumen.precioSugerido && <p>• El precio ingresado es menor que el sugerido.</p>}
    {precioVenta < resumen.costo && <p>• El precio ingresado está por debajo del costo base.</p>}
    {resumen.margenTotal < 20 && <p>• Margen de ganancia insuficiente ({resumen.margenTotal}% &lt; 20%)</p>}
    {precioVenta >= resumen.precioSugerido && precioVenta >= resumen.costo && resumen.margenTotal >= 20 && (
      <p className="text-green-700">✔️ El precio y margen son adecuados.</p>
    )}
    <p className="mt-2">Por favor confirma antes de guardar el combo.</p>
    <div className="mt-2">
      <label className="inline-flex items-center text-sm">
        <input
          type="checkbox"
          checked={confirmado}
          onChange={(e) => setConfirmado(e.target.checked)}
          className="form-checkbox h-4 w-4 text-yellow-500"
        />
        <span className="ml-2">Confirmo que deseo registrar este combo</span>
      </label>
    </div>
  </div>
)}


          <div className="flex gap-3">
            <button type="submit" className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-6 py-1.5 rounded-md" disabled={!confirmado || !formularioLleno}>Guardar combo</button>
            <button type="button" onClick={resetFormulario} className="bg-gray-400 hover:bg-gray-500 text-white font-semibold px-6 py-1.5 rounded-md">Cancelar</button>
          </div>
        </form>
      </div>

      <div className="bg-[#0e1320] p-6 rounded-xl border border-yellow-400 text-white min-h-[400px] flex flex-col">
        <h3 className="text-xl font-bold text-yellow-300 mb-2">Combos registrados</h3>
        <input type="text" placeholder="Buscar combo..." value={busquedaCombo} onChange={(e) => setBusquedaCombo(e.target.value)} className="px-4 py-2 mb-3 rounded bg-green-100 text-black" />
        <div className="overflow-y-auto flex-1 space-y-2 pr-2">
          {combosGuardados.filter((c) => c.nombre.toLowerCase().includes(busquedaCombo.toLowerCase())).map((combo, index) => (
            <div key={index} className="bg-white text-black p-3 rounded shadow">
              <p className="font-semibold">{combo.nombre}</p>
              <p className="text-sm text-gray-700">{combo.categoria}</p>
              <p className="text-sm text-gray-700 font-semibold">Precio: ${combo.precioVenta}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ComboForm;
