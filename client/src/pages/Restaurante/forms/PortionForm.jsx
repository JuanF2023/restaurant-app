// src/pages/Restaurante/forms/PortionForm.jsx
import React, { useState, useEffect } from "react";
import { Pencil, Power } from "lucide-react";

const PortionForm = () => {
  const [tipoPreparacion, setTipoPreparacion] = useState("");
  const [nombre, setNombre] = useState("");
  const [categoria, setCategoria] = useState("");
  const [tamano, setTamano] = useState("");
  const [unidad, setUnidad] = useState("");
  const [costo, setCosto] = useState("");
  const [precioVenta, setPrecioVenta] = useState("");
  const [confirmado, setConfirmado] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const [porciones, setPorciones] = useState([]);
  const [editandoIndex, setEditandoIndex] = useState(null);
  const [imagen, setImagen] = useState(null);
  const [preview, setPreview] = useState(null);

  // Márgenes por tipo de preparación
  const margenesPorTipo = {
    produccion: 0.45,
    reventa: 0.2,
    ensamblado: 0.35,
    combo: 0.25,
  };

  useEffect(() => {
    const dataGuardada = localStorage.getItem("porciones");
    if (dataGuardada) setPorciones(JSON.parse(dataGuardada));
  }, []);

  useEffect(() => {
    localStorage.setItem("porciones", JSON.stringify(porciones));
  }, [porciones]);

  // Cálculos de precios y márgenes
  const costoBase = parseFloat(costo) || 0;
  const margenSugeridoValor = tipoPreparacion
    ? costoBase * (margenesPorTipo[tipoPreparacion] || 0)
    : 0;
  const precioSugerido = costoBase
    ? (costoBase + margenSugeridoValor).toFixed(2)
    : "0.00";
  const precioReal = parseFloat(precioVenta) || 0;
  const margenSugerido = costoBase
    ? ((margenSugeridoValor / costoBase) * 100).toFixed(2)
    : "0";
  const margenReal = costoBase
    ? (((precioReal - costoBase) / costoBase) * 100).toFixed(2)
    : "0";

  // Recomendación
  let recomendacion = "";
  if (precioReal < parseFloat(precioSugerido)) {
    recomendacion = "⚠️ Precio menor al sugerido. Considera aumentarlo.";
  } else if (precioReal === parseFloat(precioSugerido)) {
    recomendacion = "✅ Precio igual al sugerido. Configuración aceptable.";
  } else {
    recomendacion = "✅ Precio mayor al sugerido. Configuración óptima.";
  }

  const resetFormulario = () => {
    setNombre("");
    setCategoria("");
    setTamano("");
    setUnidad("");
    setCosto("");
    setPrecioVenta("");
    setTipoPreparacion("");
    setConfirmado(false);
    setImagen(null);
    setPreview(null);
    setEditandoIndex(null);
  };

  const formularioLleno =
    nombre && categoria && tipoPreparacion && tamano && unidad && costo && precioVenta;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!confirmado || !formularioLleno) return;

    const nuevaPorcion = {
      nombre,
      categoria,
      tipoPreparacion,
      tamano: parseFloat(tamano),
      unidad,
      costo: costoBase,
      margen: parseFloat(margenSugerido),
      precioSugerido: parseFloat(precioSugerido),
      precioVenta: precioReal,
      imagen: preview,
      creadoPor: "sistema",
      fechaCreacion: new Date().toISOString(),
      activo: true,
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
    setTipoPreparacion(porcion.tipoPreparacion || "");
    setPreview(porcion.imagen || null);
    setEditandoIndex(index);
    setConfirmado(false);
  };

  const toggleActivo = (index) => {
    const nuevasPorciones = [...porciones];
    nuevasPorciones[index].activo = !nuevasPorciones[index].activo;
    setPorciones(nuevasPorciones);
  };

  const iconoPorCategoria = {
    entrada: "🍟",
    principal: "🍽️",
    postre: "🍰",
    bebida: "🥤",
  };

  const categoriasUnicas = [...new Set(porciones.map((p) => p.categoria))];
  const total = porciones.length;
  const promedioPrecio = total
    ? (
      porciones.reduce(
        (sum, p) => sum + parseFloat(p.precioVenta || 0),
        0
      ) / total
    ).toFixed(2)
    : 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6 text-white">
      {/* Panel izquierdo */}
      <div className="bg-[#1a2238] p-6 rounded-xl border border-yellow-500">
        <h2 className="text-xl font-bold text-yellow-300 mb-1">🍽️ Porciones</h2>
        <p className="text-sm text-slate-300 mb-4">
          Registrar nueva porción para el menú.
        </p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Nombre"
            className="w-full px-4 py-2 bg-[#2c3e50] text-white rounded-md"
            required
          />
          <input
            type="number"
            value={costo}
            onChange={(e) => setCosto(e.target.value)}
            placeholder="Costo base"
            className="w-full px-4 py-2 bg-[#2c3e50] text-white rounded-md"
            required
          />
          <input
            type="number"
            value={precioVenta}
            onChange={(e) => setPrecioVenta(e.target.value)}
            placeholder="Precio de venta"
            className={`w-full px-4 py-2 rounded-md ${precioVenta < precioSugerido || precioVenta < costo
                ? "bg-red-100 text-red-700"
                : "bg-[#2c3e50] text-white"
              }`}
            required
          />
          <select
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            className="w-full px-4 py-2 bg-[#2c3e50] text-white rounded-md"
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

          <select
            value={tipoPreparacion}
            onChange={(e) => setTipoPreparacion(e.target.value)}
            className="w-full px-4 py-2 bg-[#2c3e50] text-white rounded-md"
            required
          >
            <option value="" disabled hidden>
              Seleccione tipo de preparación
            </option>
            <option value="produccion">Producción</option>
            <option value="reventa">Reventa</option>
            <option value="ensamblado">Ensamblado</option>
            <option value="combo">Combo</option>
          </select>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="number"
              value={tamano}
              onChange={(e) => setTamano(e.target.value)}
              placeholder="Tamaño"
              className="px-4 py-2 bg-[#2c3e50] text-white rounded-md"
              required
            />
            <select
              value={unidad}
              onChange={(e) => setUnidad(e.target.value)}
              className="px-4 py-2 bg-[#2c3e50] text-white rounded-md"
              required
            >
              <option value="" disabled hidden>
                Unidad
              </option>
              <option value="oz">oz</option>
              <option value="piezas">piezas</option>
              <option value="rodajas">rodajas</option>
              <option value="unidades">unidades</option>
            </select>
          </div>

          {/* Valores calculados */}
          {/* Precio sugerido y precio real */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <input
              type="text"
              value={`Precio sugerido: $${precioSugerido}`}
              readOnly
              className="w-full px-4 py-2 bg-slate-800 text-slate-300 rounded-md"
            />
            <input
              type="text"
              value={`Margen sugerido: ${margenSugerido}%`}
              readOnly
              className="w-full px-4 py-2 bg-slate-800 text-slate-300 rounded-md"
            />
          </div>

          {/* Margen sugerido y margen real */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <input
              type="text"
              value={`Precio real: $${precioVenta}`}
              readOnly
              className="w-full px-4 py-2 bg-slate-800 text-slate-300 rounded-md"
            />
            
            <input
              type="text"
              value={`Margen real: ${margenReal}%`}
              readOnly
              className="w-full px-4 py-2 bg-slate-800 text-slate-300 rounded-md"
            />
          </div>


          {/* Resumen dinámico */}
          {formularioLleno && (
            <div
              className={`p-3 rounded-md text-sm mt-3 ${precioVenta < precioSugerido
                  ? "bg-yellow-100 border border-yellow-400 text-yellow-800"
                  : precioVenta == precioSugerido
                    ? "bg-blue-100 border border-blue-400 text-blue-800"
                    : "bg-green-100 border border-green-400 text-green-800"
                }`}
            >
              <p className="font-bold mb-1">🧾 Resumen</p>
              <p>{recomendacion}</p>
              <p>Costo base: ${costoBase.toFixed(2)}</p>
              <p>Precio sugerido: ${precioSugerido}</p>
              <p>Margen sugerido: {margenSugerido}%</p>
              <p>Margen real: {margenReal}%</p>
            </div>
          )}

          {/* Confirmación */}
          {formularioLleno && (
            <div className="bg-yellow-100 border border-yellow-400 p-3 rounded-md text-yellow-800 text-sm mt-3">
              <label className="inline-flex items-center text-sm">
                <input
                  type="checkbox"
                  checked={confirmado}
                  onChange={(e) => setConfirmado(e.target.checked)}
                  className="form-checkbox h-4 w-4 text-yellow-500"
                />
                <span className="ml-2">
                  Confirmo que deseo registrar esta porción
                </span>
              </label>
            </div>
          )}

          {/* Botones */}
          <div className="flex gap-3">
            <button
              type="submit"
              className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-6 py-2 rounded-md"
              disabled={!confirmado || !formularioLleno}
            >
              Guardar
            </button>
            <button
              type="button"
              onClick={resetFormulario}
              className="bg-slate-600 hover:bg-slate-700 text-white font-semibold px-6 py-2 rounded-md"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>

      {/* Panel derecho */}
      <div className="bg-[#1a2238] p-6 rounded-xl border border-yellow-500">
        <h3 className="text-lg font-bold text-yellow-300 mb-2">
          Porciones registradas
        </h3>
        <input
          type="text"
          placeholder="Buscar..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="px-4 py-2 mb-3 rounded bg-[#2c3e50] text-white w-full"
        />
        <div className="overflow-y-auto max-h-[400px] space-y-2 pr-2">
          {porciones
            .filter(
              (p) =>
                p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
                p.categoria.toLowerCase().includes(busqueda.toLowerCase())
            )
            .map((p, i) => (
              <div
                key={i}
                className="p-3 rounded shadow bg-slate-100 text-black relative group hover:bg-slate-200 transition"
              >
                <div>
                  <p className="font-semibold">
                    {iconoPorCategoria[p.categoria] || "🍴"} {p.nombre}
                  </p>
                  <p className="text-sm">
                    {p.categoria} • {p.tamano} {p.unidad}
                  </p>
                  <p className="text-sm font-semibold">
                    Precio: ${p.precioVenta}
                  </p>
                  <p
                    className={`text-xs mt-1 ${p.activo ? "text-green-600" : "text-red-600"
                      }`}
                  >
                    {p.activo ? "Activo" : "Inactivo"}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-2 absolute top-2 right-2">
                  <button
                    title="Editar porción"
                    onClick={() => handleEdit(i)}
                    className="p-2 rounded-full text-blue-600 hover:text-blue-800 transition-transform transform hover:scale-110 focus:outline-none active:scale-95"
                  >
                    <Pencil size={20} />
                  </button>
                  <button
                    title={p.activo ? "Desactivar porción" : "Activar porción"}
                    onClick={() => toggleActivo(i)}
                    className={`p-2 rounded-full transition-transform transform hover:scale-110 focus:outline-none active:scale-95 ${p.activo
                        ? "text-red-500 hover:text-red-700"
                        : "text-green-600 hover:text-green-800"
                      }`}
                  >
                    <Power size={20} />
                  </button>
                </div>
              </div>
            ))}
        </div>
        <div className="border-t border-yellow-500 pt-3 mt-3 text-sm text-slate-400">
          <p>Total: {total} porciones</p>
          <p>Precio promedio: ${promedioPrecio}</p>
          <p>Categorías: {categoriasUnicas.length}</p>
        </div>
      </div>
    </div>
  );
};

export default PortionForm;
