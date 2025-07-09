import React, { useState, useEffect } from "react";
import { Pencil } from "lucide-react";

const PortionForm = () => {
  const [nombre, setNombre] = useState("");
  const [categoria, setCategoria] = useState("");
  const [tamano, setTamano] = useState("");
  const [unidad, setUnidad] = useState("");
  const [costo, setCosto] = useState("");
  const [margen, setMargen] = useState(20);
  const [precioVenta, setPrecioVenta] = useState("");
  const [confirmado, setConfirmado] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const [porciones, setPorciones] = useState([]);
  const [editandoIndex, setEditandoIndex] = useState(null);
  const [imagen, setImagen] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    const dataGuardada = localStorage.getItem("porciones");
    if (dataGuardada) setPorciones(JSON.parse(dataGuardada));
  }, []);

  useEffect(() => {
    localStorage.setItem("porciones", JSON.stringify(porciones));
  }, [porciones]);

  const precioSugerido = costo && margen ? (parseFloat(costo) * (1 + margen / 100)).toFixed(2) : "";
  const margenReal = costo && precioVenta ? (((precioVenta - costo) / costo) * 100).toFixed(2) : "";

  const resetFormulario = () => {
    setNombre("");
    setCategoria("");
    setTamano("");
    setUnidad("");
    setCosto("");
    setPrecioVenta("");
    setConfirmado(false);
    setImagen(null);
    setPreview(null);
    setEditandoIndex(null);
  };

  const formularioLleno = nombre && categoria && tamano && unidad && costo && precioVenta;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!confirmado || !formularioLleno) return;

    const nuevaPorcion = {
      nombre,
      categoria,
      tamano: parseFloat(tamano),
      unidad,
      costo: parseFloat(costo),
      margen,
      precioSugerido,
      precioVenta: parseFloat(precioVenta),
      imagen: preview,
      creadoPor: "sistema",
      fechaCreacion: new Date().toISOString(),
    };

    if (editandoIndex !== null) {
      const nuevasPorciones = [...porciones];
      nuevasPorciones[editandoIndex] = nuevaPorcion;
      setPorciones(nuevasPorciones);
    } else {
      setPorciones([nuevaPorcion, ...porciones]);
    }

    resetFormulario();
  };

  const handleEdit = (index) => {
    const porcion = porciones[index];
    setNombre(porcion.nombre);
    setCategoria(porcion.categoria);
    setTamano(porcion.tamano);
    setUnidad(porcion.unidad);
    setCosto(porcion.costo);
    setPrecioVenta(porcion.precioVenta);
    setPreview(porcion.imagen || null);
    setEditandoIndex(index);
    setConfirmado(false);
  };

  const iconoPorCategoria = {
    entrada: "🍟",
    principal: "🍽️",
    postre: "🍰",
    bebida: "🥤",
  };

  const categoriasUnicas = [...new Set(porciones.map((p) => p.categoria))];
  const total = porciones.length;
  const promedioPrecio = total ? (porciones.reduce((sum, p) => sum + parseFloat(p.precioVenta || 0), 0) / total).toFixed(2) : 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
      <div className="bg-[#0e1320] p-6 rounded-xl shadow-md border border-yellow-400">
        <h2 className="text-2xl font-bold text-yellow-400 mb-2 flex items-center gap-2">🍽️ Porciones</h2>
        <p className="text-white mb-3">Registra aquí una nueva porción para el menú.</p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Ingrese el nombre de la porción. Ej: Papas fritas" className="w-full px-4 py-1.5 bg-green-100 rounded-md text-black" required />

          <input type="number" value={costo} onChange={(e) => setCosto(e.target.value)} placeholder="Ingrese costo base. Ej: 2.50" className="w-full px-4 py-1.5 bg-green-100 rounded-md text-black" required />

          <input type="number" value={precioVenta} onChange={(e) => setPrecioVenta(e.target.value)} placeholder="Ingrese precio de venta" className={`w-full px-4 py-1.5 rounded-md ${precioVenta < precioSugerido || precioVenta < costo ? "bg-red-100 text-red-600" : "bg-green-100 text-black"}`} required />

          <select value={categoria} onChange={(e) => setCategoria(e.target.value)} className="w-full px-4 py-1.5 bg-green-100 rounded-md text-black" required>
            <option value="" disabled hidden>Seleccione categoría</option>
            <option value="entrada">Entrada</option>
            <option value="principal">Plato principal</option>
            <option value="postre">Postre</option>
            <option value="bebida">Bebida</option>
          </select>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input type="number" value={tamano} onChange={(e) => setTamano(e.target.value)} placeholder="Ingrese tamaño. Ej: 4" className="px-4 py-1.5 bg-green-100 rounded-md text-black" required />
            <select value={unidad} onChange={(e) => setUnidad(e.target.value)} className="px-4 py-1.5 bg-green-100 rounded-md text-black" required>
              <option value="" disabled hidden>Seleccione unidad</option>
              <option value="oz">oz</option>
              <option value="piezas">piezas</option>
              <option value="rodajas">rodajas</option>
              <option value="unidades">unidades</option>
            </select>
          </div>

          <input type="text" value={`Precio sugerido: $${precioSugerido}`} readOnly className="w-full px-4 py-1.5 bg-gray-200 text-gray-600 rounded-md" />
          <input type="text" value={`Margen sugerido: ${margen}%`} readOnly className="w-full px-4 py-1.5 bg-gray-200 text-gray-600 rounded-md" />
          <input type="text" value={margenReal ? `Margen real: ${margenReal}%` : ""} readOnly className={`w-full px-4 py-1.5 bg-gray-200 rounded-md ${margenReal < margen ? "text-red-600" : "text-gray-600"}`} placeholder="Margen real" />

          <div>
            <label className="block text-white mb-1">Imagen de la porción (opcional)</label>
            <input 
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                setImagen(file);
                setPreview(URL.createObjectURL(file));
              }}
              className="block w-full text-sm text-white file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:font-semibold file:bg-yellow-300 file:text-black hover:file:bg-yellow-400"
            />
            {preview && <img src={preview} alt="Vista previa" className="mt-2 rounded-md w-24 h-24 object-cover border" />}
          </div>

          {!confirmado && formularioLleno && (
            <div className="bg-yellow-100 border border-yellow-400 p-3 rounded-md text-yellow-800 text-sm">
              <p><strong>Resumen:</strong></p>
              {precioVenta < precioSugerido && <p>⚠️ El precio ingresado es ${Math.abs(precioVenta - precioSugerido).toFixed(2)} menor que el sugerido.</p>}
              {precioVenta < costo && <p>❌ El precio ingresado está por debajo del costo base.</p>}
              {margenReal < margen && <p>⚠️ Margen de ganancia insuficiente ({margenReal}% &lt; {margen}%)</p>}
              {precioVenta >= precioSugerido && precioVenta >= costo && margenReal >= margen && <p>✔️ El precio y margen son adecuados.</p>}
              <p className="mt-2">Por favor confirma antes de guardar la porción.</p>
              <div className="mt-2">
                <label className="inline-flex items-center">
                  <input type="checkbox" checked={confirmado} onChange={(e) => setConfirmado(e.target.checked)} className="form-checkbox h-4 w-4 text-green-600" />
                  <span className="ml-2 text-sm">Confirmo que deseo registrar esta porción</span>
                </label>
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <button type="submit" className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-6 py-1.5 rounded-md" disabled={!confirmado || !formularioLleno}>Guardar porción</button>
            <button type="button" onClick={resetFormulario} className="bg-gray-400 hover:bg-gray-500 text-white font-semibold px-6 py-1.5 rounded-md">Cancelar</button>
          </div>
        </form>
      </div>

      <div className="bg-[#0e1320] p-6 rounded-xl border border-yellow-400 min-h-[400px] text-white flex flex-col">
        <h3 className="text-xl font-bold text-yellow-300 mb-2">Porciones registradas</h3>
        <input type="text" placeholder="Buscar porción..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)} className="px-4 py-2 rounded bg-green-100 text-black mb-3" />

        <div className="overflow-y-auto flex-1 pr-2 space-y-2">
          {porciones.filter((p) => p.nombre.toLowerCase().includes(busqueda.toLowerCase()) || p.categoria.toLowerCase().includes(busqueda.toLowerCase()))
            .map((p, i) => (
              <div key={i} className="bg-white text-black p-3 rounded shadow flex justify-between items-center">
                <div>
                  <p className="font-semibold">{iconoPorCategoria[p.categoria] || "🍴"} {p.nombre}</p>
                  <p className="text-sm text-gray-700">{p.categoria} • {p.tamano} {p.unidad}</p>
                  <p className="text-sm text-gray-700 font-semibold">Precio: ${p.precioVenta}</p>
                </div>
                <button title="Editar porción" className="text-blue-600 hover:text-blue-800" onClick={() => handleEdit(i)}><Pencil size={16} /></button>
              </div>
            ))}
        </div>

        <div className="border-t border-yellow-500 pt-3 mt-3 text-sm text-gray-300">
          <p>Total: {total} porciones</p>
          <p>Precio promedio: ${promedioPrecio}</p>
          <p>Categorías: {categoriasUnicas.length}</p>
        </div>
      </div>
    </div>
  );
};

export default PortionForm;
