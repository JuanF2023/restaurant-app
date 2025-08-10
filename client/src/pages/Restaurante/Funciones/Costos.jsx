import React, { useMemo, useState } from "react";
import { useCostos } from "../../../context/CostosContext.jsx";
import {
  PlusCircle,
  Save,
  X,
  Filter,
  Pencil,
  CheckCircle2,
  Clock,
  Calendar,
  DollarSign,
  Building2,
  FileUp,
  FileSpreadsheet,
  Tags,
  Wallet,
  Hash,
} from "lucide-react";
import * as XLSX from "xlsx";

// --------- helpers ----------
const fmtMoney = (n) =>
  (n ?? 0).toLocaleString("es-SV", { style: "currency", currency: "USD", minimumFractionDigits: 2 });

const startOfMonth = (d = new Date()) => new Date(d.getFullYear(), d.getMonth(), 1);
const endOfMonth = (d = new Date()) => new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999);
const inRange = (date, from, to) => {
  const t = new Date(date).getTime();
  return (!from || t >= new Date(from).getTime()) && (!to || t <= new Date(to).getTime());
};

// Compra = categorías donde tiene sentido pedir factura
const esCompra = (categoria) => ["Insumos", "Compras"].includes(categoria || "");

// --------- componente ----------
export default function Costos() {
  // Catálogos base (puedes convertirlos a API luego)
  const [categorias, setCategorias] = useState([
    "Renta",
    "Servicios (agua/luz/internet)",
    "Insumos",
    "Nómina",
    "Impuestos",
    "Mantenimiento",
    "Marketing",
    "Compras",
    "Otros",
  ]);
  const [proveedores] = useState(["Alquiladora XYZ", "Distribuidora ABC", "Empleado", "Gobierno", "Otro"]);
  const metodos = ["Efectivo", "Transferencia", "Tarjeta", "Cheque", "Mixto"];

  // Datos
  const [costos, setCostos] = useState([
    {
      id: 1,
      fecha: new Date().toISOString().slice(0, 10),
      categoria: "Servicios (agua/luz/internet)",
      proveedor: "AES",
      descripcion: "Factura de energía julio",
      metodo: "Transferencia",
      subTotal: 85,
      impuestoPct: 13,
      total: 96.05,
      pagado: true,
      vence: new Date().toISOString().slice(0, 10),
      adjunto: "",
      notas: "",
      tieneFactura: true,
      numeroFactura: "E-2025-07821",
    },
    {
      id: 2,
      fecha: new Date().toISOString().slice(0, 10),
      categoria: "Insumos",
      proveedor: "Distribuidora ABC",
      descripcion: "Aceite + desechables",
      metodo: "Efectivo",
      subTotal: 120,
      impuestoPct: 0,
      total: 120,
      pagado: false,
      vence: new Date(Date.now() + 4 * 86400000).toISOString().slice(0, 10),
      adjunto: "",
      notas: "Entrega parcial",
      tieneFactura: false,
      numeroFactura: "",
    },
  ]);

  // Formulario
  const initialForm = {
    id: null,
    fecha: new Date().toISOString().slice(0, 10),
    categoria: "",
    proveedor: "",
    descripcion: "",
    metodo: "Efectivo",
    subTotal: "",
    impuestoPct: 0,
    total: 0,
    pagado: false,
    vence: "",
    adjunto: "",
    notas: "",
    tieneFactura: false,
    numeroFactura: "",
  };
  const [form, setForm] = useState(initialForm);
  const [editando, setEditando] = useState(false);

  // Filtros
  const [q, setQ] = useState("");
  const [fEstado, setFEstado] = useState("Todos"); // Todos | Pagado | Pendiente
  const [fCategoria, setFCategoria] = useState("Todas");
  const [fDesde, setFDesde] = useState(startOfMonth().toISOString().slice(0, 10));
  const [fHasta, setFHasta] = useState(endOfMonth().toISOString().slice(0, 10));

  // Derivados
  const costosFiltrados = useMemo(() => {
    return costos
      .filter((c) => inRange(c.fecha, fDesde, fHasta))
      .filter((c) => (fEstado === "Todos" ? true : fEstado === "Pagado" ? c.pagado : !c.pagado))
      .filter((c) => (fCategoria === "Todas" ? true : c.categoria === fCategoria))
      .filter((c) => {
        const s = q.trim().toLowerCase();
        if (!s) return true;
        return (
          c.descripcion.toLowerCase().includes(s) ||
          (c.proveedor || "").toLowerCase().includes(s) ||
          (c.categoria || "").toLowerCase().includes(s) ||
          (c.numeroFactura || "").toLowerCase().includes(s)
        );
      });
  }, [costos, q, fEstado, fCategoria, fDesde, fHasta]);

  const kpis = useMemo(() => {
    const hoy = new Date();
    const delMes = costos.filter((c) => inRange(c.fecha, startOfMonth(hoy), endOfMonth(hoy))).reduce((a, c) => a + (c.total || 0), 0);
    const pendientes = costos.filter((c) => !c.pagado);
    const porVencer = pendientes.filter((c) => c.vence && new Date(c.vence) - new Date() <= 7 * 86400000);
    return {
      gastoMes: delMes,
      pendientes: pendientes.length,
      porVencer: porVencer.length,
    };
  }, [costos]);

  // Handlers
  const calcTotal = (st, pct) => {
    const sub = Number(st || 0);
    const imp = Number(pct || 0);
    return +(sub + (sub * imp) / 100).toFixed(2);
  };

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (name === "subTotal" || name === "impuestoPct") {
      const next = { ...form, [name]: value };
      next.total = calcTotal(next.subTotal, next.impuestoPct);
      setForm(next);
    } else if (name === "adjunto") {
      setForm({ ...form, adjunto: files?.[0]?.name || "" });
    } else if (type === "checkbox") {
      setForm({ ...form, [name]: checked });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const guardar = () => {
    if (!form.fecha || !form.categoria || !form.descripcion || !form.subTotal) return;
    // Si marcó factura, exigir número
    if (form.tieneFactura && !String(form.numeroFactura || "").trim()) {
      alert("Ingresa el número de factura.");
      return;
    }

    const payload = {
      ...form,
      subTotal: +form.subTotal,
      impuestoPct: +form.impuestoPct,
      total: calcTotal(form.subTotal, form.impuestoPct),
    };

    if (editando) {
      setCostos((prev) => prev.map((c) => (c.id === form.id ? payload : c)));
    } else {
      setCostos((prev) => [{ ...payload, id: Date.now() }, ...prev]);
    }
    cancelar();
  };

  const cancelar = () => {
    setForm(initialForm);
    setEditando(false);
  };

  const editar = (row) => {
    setForm({ ...row });
    setEditando(true);
  };

  const togglePagado = (id) =>
    setCostos((p) => p.map((c) => (c.id === id ? { ...c, pagado: !c.pagado } : c)));

  const exportarExcel = () => {
    const data = costosFiltrados.map((c) => ({
      Fecha: c.fecha,
      Categoría: c.categoria,
      Proveedor: c.proveedor,
      Descripción: c.descripcion,
      Método: c.metodo,
      Subtotal: c.subTotal,
      "Impuesto %": c.impuestoPct,
      Total: c.total,
      Estado: c.pagado ? "Pagado" : "Pendiente",
      Vence: c.vence || "",
      "Tiene factura": c.tieneFactura ? "Sí" : "No",
      "N° factura": c.numeroFactura || "",
      Adjunto: c.adjunto || "",
      Notas: c.notas || "",
    }));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(data), "Costos");
    XLSX.writeFile(wb, `Costos_${fDesde}_${fHasta}.xlsx`);
  };

  const agregarCategoriaRapido = (nombre) => {
    const n = (nombre || "").trim();
    if (!n) return;
    if (!categorias.includes(n)) setCategorias((p) => [...p, n]);
    setForm((f) => ({ ...f, categoria: n }));
  };

  // UI
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-bold text-white">Registro de costos</h2>
          <p className="text-slate-400 text-sm">Captura y controla todos los costos del restaurante</p>
        </div>
        <button
          onClick={exportarExcel}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-700 bg-slate-900 text-slate-100 hover:border-yellow-400 hover:shadow-[0_0_0_1px_rgba(250,204,21,0.35)]"
        >
          <FileSpreadsheet size={16} />
          Exportar Excel
        </button>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl p-4 bg-gradient-to-br from-yellow-400 to-yellow-500 text-black ring-1 ring-black/10">
          <p className="text-[11px] uppercase tracking-wide">Gasto del mes</p>
          <p className="text-2xl font-extrabold mt-1">{fmtMoney(kpis.gastoMes)}</p>
        </div>
        <div className="rounded-2xl p-4 bg-gradient-to-br from-rose-600 to-rose-700 text-white ring-1 ring-white/10">
          <p className="text-[11px] uppercase tracking-wide">Pendientes</p>
          <p className="text-2xl font-extrabold mt-1">{kpis.pendientes}</p>
        </div>
        <div className="rounded-2xl p-4 bg-gradient-to-br from-amber-600 to-amber-700 text-white ring-1 ring-white/10">
          <p className="text-[11px] uppercase tracking-wide">Por vencer (7 días)</p>
          <p className="text-2xl font-extrabold mt-1">{kpis.porVencer}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Formulario */}
        <section className="rounded-2xl border border-slate-700 bg-gradient-to-br from-slate-900/90 to-slate-950 p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-yellow-300 font-semibold flex items-center gap-2">
              <PlusCircle size={18} /> {editando ? "Editar costo" : "Agregar costo"}
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <label className="text-sm text-slate-300">
              Fecha
              <div className="flex items-center gap-2 mt-1">
                <Calendar size={16} className="text-slate-400" />
                <input
                  type="date"
                  name="fecha"
                  value={form.fecha}
                  onChange={handleChange}
                  className="w-full rounded-md bg-slate-900 border border-slate-700 text-slate-100 px-3 py-2"
                />
              </div>
            </label>

            <label className="text-sm text-slate-300">
              Categoría
              <div className="flex gap-2 mt-1">
                <select
                  name="categoria"
                  value={form.categoria}
                  onChange={handleChange}
                  className="flex-1 rounded-md bg-slate-900 border border-slate-700 text-slate-100 px-3 py-2"
                >
                  <option value="">Selecciona</option>
                  {categorias.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                {/* Add rápido */}
                <button
                  type="button"
                  onClick={() => {
                    const n = prompt("Nueva categoría:");
                    if (n) agregarCategoriaRapido(n);
                  }}
                  className="px-3 rounded-md border border-slate-700 text-slate-100 bg-slate-900 hover:border-yellow-400"
                  title="Agregar categoría"
                >
                  <Tags size={16} />
                </button>
              </div>
            </label>

            <label className="text-sm text-slate-300">
              Proveedor
              <div className="flex items-center gap-2 mt-1">
                <Building2 size={16} className="text-slate-400" />
                <input
                  list="proveedores"
                  name="proveedor"
                  value={form.proveedor}
                  onChange={handleChange}
                  placeholder="Proveedor"
                  className="w-full rounded-md bg-slate-900 border border-slate-700 text-slate-100 px-3 py-2 placeholder-slate-500"
                />
                <datalist id="proveedores">
                  {proveedores.map((p) => (
                    <option key={p} value={p} />
                  ))}
                </datalist>
              </div>
            </label>

            <label className="text-sm text-slate-300">
              Método de pago
              <div className="flex items-center gap-2 mt-1">
                <Wallet size={16} className="text-slate-400" />
                <select
                  name="metodo"
                  value={form.metodo}
                  onChange={handleChange}
                  className="w-full rounded-md bg-slate-900 border border-slate-700 text-slate-100 px-3 py-2"
                >
                  {metodos.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>
            </label>

            <label className="text-sm text-slate-300 md:col-span-2">
              Descripción
              <input
                name="descripcion"
                value={form.descripcion}
                onChange={handleChange}
                placeholder="Ej. compra de verduras, factura energía, etc."
                className="mt-1 w-full rounded-md bg-slate-900 border border-slate-700 text-slate-100 px-3 py-2 placeholder-slate-500"
              />
            </label>

            <label className="text-sm text-slate-300">
              Subtotal
              <div className="flex items-center gap-2 mt-1">
                <DollarSign size={16} className="text-slate-400" />
                <input
                  name="subTotal"
                  value={form.subTotal}
                  onChange={handleChange}
                  placeholder="0.00"
                  inputMode="decimal"
                  className="w-full rounded-md bg-slate-900 border border-slate-700 text-slate-100 px-3 py-2"
                />
              </div>
            </label>

            <label className="text-sm text-slate-300">
              Impuesto (%)
              <input
                name="impuestoPct"
                value={form.impuestoPct}
                onChange={handleChange}
                placeholder="0"
                inputMode="decimal"
                className="mt-1 w-full rounded-md bg-slate-900 border border-slate-700 text-slate-100 px-3 py-2"
              />
            </label>

            <div className="md:col-span-2 grid grid-cols-2 gap-3">
              <label className="text-sm text-slate-300">
                Total
                <div className="mt-1 w-full rounded-md bg-slate-800 border border-slate-700 text-slate-100 px-3 py-2">
                  {fmtMoney(form.total || 0)}
                </div>
              </label>

              <label className="text-sm text-slate-300">
                Vence
                <input
                  type="date"
                  name="vence"
                  value={form.vence}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-md bg-slate-900 border border-slate-700 text-slate-100 px-3 py-2"
                />
              </label>
            </div>

            {/* Factura (solo cuando es compra) */}
            {esCompra(form.categoria) && (
              <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-3">
                <label className="flex items-center gap-2 text-slate-200">
                  <input
                    type="checkbox"
                    name="tieneFactura"
                    checked={form.tieneFactura}
                    onChange={handleChange}
                  />
                  ¿Tiene factura?
                </label>

                {form.tieneFactura && (
                  <label className="text-sm text-slate-300 md:col-span-2">
                    Número de factura
                    <div className="flex items-center gap-2 mt-1">
                      <Hash size={16} className="text-slate-400" />
                      <input
                        name="numeroFactura"
                        value={form.numeroFactura}
                        onChange={handleChange}
                        placeholder="Ej. A-00123456"
                        className="w-full rounded-md bg-slate-900 border border-slate-700 text-slate-100 px-3 py-2"
                      />
                    </div>
                  </label>
                )}
              </div>
            )}

            <label className="text-sm text-slate-300">
              Adjunto (opcional)
              <div className="flex items-center gap-2 mt-1">
                <FileUp size={16} className="text-slate-400" />
                <input type="file" name="adjunto" onChange={handleChange} className="w-full text-slate-200" />
              </div>
              {form.adjunto && <p className="text-xs text-slate-400 mt-1">Archivo: {form.adjunto}</p>}
            </label>

            <label className="text-sm text-slate-300 md:col-span-2">
              Notas
              <textarea
                name="notas"
                value={form.notas}
                onChange={handleChange}
                rows={2}
                className="mt-1 w-full rounded-md bg-slate-900 border border-slate-700 text-slate-100 px-3 py-2"
              />
            </label>

            <label className="flex items-center gap-2 text-slate-200 md:col-span-2">
              <input type="checkbox" name="pagado" checked={form.pagado} onChange={handleChange} />
              ¿Marcado como pagado?
            </label>
          </div>

          <div className="mt-4 flex gap-2">
            <button
              onClick={guardar}
              className="inline-flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-4 py-2 rounded transition-all"
            >
              <Save size={18} /> {editando ? "Guardar cambios" : "Guardar costo"}
            </button>
            <button
              onClick={cancelar}
              className="inline-flex items-center gap-2 bg-slate-800 border border-slate-700 text-slate-100 px-4 py-2 rounded hover:border-yellow-400"
            >
              <X size={18} /> Cancelar
            </button>
          </div>
        </section>

        {/* Filtros + Lista */}
        <section className="rounded-2xl border border-slate-700 bg-gradient-to-br from-slate-900/90 to-slate-950 p-4">
          {/* Filtros */}
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-yellow-300 font-semibold flex items-center gap-2">
              <Filter size={18} /> Filtros
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-2 mb-4">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar…"
              className="rounded-md bg-slate-900 border border-slate-700 text-slate-100 px-3 py-2 placeholder-slate-500"
            />
            <select
              value={fEstado}
              onChange={(e) => setFEstado(e.target.value)}
              className="rounded-md bg-slate-900 border border-slate-700 text-slate-100 px-3 py-2"
            >
              {["Todos", "Pagado", "Pendiente"].map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
            <select
              value={fCategoria}
              onChange={(e) => setFCategoria(e.target.value)}
              className="rounded-md bg-slate-900 border border-slate-700 text-slate-100 px-3 py-2"
            >
              <option>Todas</option>
              {categorias.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
            <input
              type="date"
              value={fDesde}
              onChange={(e) => setFDesde(e.target.value)}
              className="rounded-md bg-slate-900 border border-slate-700 text-slate-100 px-3 py-2"
            />
            <input
              type="date"
              value={fHasta}
              onChange={(e) => setFHasta(e.target.value)}
              className="rounded-md bg-slate-900 border border-slate-700 text-slate-100 px-3 py-2"
            />
          </div>

          {/* Lista */}
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-slate-300 text-xs uppercase">
                  <th className="py-2 border-b border-slate-700">Fecha</th>
                  <th className="py-2 border-b border-slate-700">Categoría</th>
                  <th className="py-2 border-b border-slate-700">Proveedor</th>
                  <th className="py-2 border-b border-slate-700">Descripción</th>
                  <th className="py-2 border-b border-slate-700">Método</th>
                  <th className="py-2 border-b border-slate-700 text-right">Total</th>
                  <th className="py-2 border-b border-slate-700">Estado</th>
                  <th className="py-2 border-b border-slate-700">Vence</th>
                  <th className="py-2 border-b border-slate-700">Factura</th>
                  <th className="py-2 border-b border-slate-700">Adj.</th>
                  <th className="py-2 border-b border-slate-700 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {costosFiltrados.map((c) => (
                  <tr key={c.id} className="text-slate-100">
                    <td className="py-2 border-b border-slate-800">{c.fecha}</td>
                    <td className="py-2 border-b border-slate-800">{c.categoria}</td>
                    <td className="py-2 border-b border-slate-800">{c.proveedor}</td>
                    <td className="py-2 border-b border-slate-800">{c.descripcion}</td>
                    <td className="py-2 border-b border-slate-800">{c.metodo}</td>
                    <td className="py-2 border-b border-slate-800 text-right">{fmtMoney(c.total)}</td>
                    <td className="py-2 border-b border-slate-800">
                      {c.pagado ? (
                        <span className="inline-flex items-center gap-1 text-emerald-300 bg-emerald-400/10 border border-emerald-500/30 px-2 py-0.5 rounded">
                          <CheckCircle2 size={14} /> Pagado
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-amber-300 bg-amber-400/10 border border-amber-500/30 px-2 py-0.5 rounded">
                          <Clock size={14} /> Pendiente
                        </span>
                      )}
                    </td>
                    <td className="py-2 border-b border-slate-800">{c.vence || "-"}</td>
                    <td className="py-2 border-b border-slate-800">
                      {c.tieneFactura ? (c.numeroFactura || "—") : "—"}
                    </td>
                    <td className="py-2 border-b border-slate-800">{c.adjunto ? "Sí" : "—"}</td>
                    <td className="py-2 border-b border-slate-800 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => editar(c)}
                          className="p-1.5 rounded bg-slate-800/70 border border-slate-700 hover:border-blue-400/50"
                          title="Editar"
                        >
                          <Pencil size={16} className="text-blue-300" />
                        </button>
                        <button
                          onClick={() => togglePagado(c.id)}
                          className="p-1.5 rounded bg-slate-800/70 border border-slate-700 hover:border-emerald-400/50"
                          title="Alternar pagado"
                        >
                          <CheckCircle2 size={16} className="text-emerald-300" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {costosFiltrados.length === 0 && (
                  <tr>
                    <td colSpan={11} className="py-6 text-center text-slate-400">
                      No hay registros con los filtros actuales.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
