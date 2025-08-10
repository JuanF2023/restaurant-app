import React, { useMemo, useState, useRef } from "react";
import { useCostos } from "../../context/CostosContext.jsx";
import {
  Banknote,
  Receipt,
  LineChart as LineChartIcon,
  Percent,
  CreditCard,
  CircleDollarSign,
  TrendingUp,
  FileSpreadsheet,
  FileText,
  Printer,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";


/**
 * Reports.jsx – KPIs del gerente con selector de período
 * + Costos reales desde Context (Costos.jsx)
 * + Utilidad, Margen, Ventas vs Costos, Costos por categoría
 * - Exportar Excel (con costos)
 * - PDF/Imprimir exacto (captura)
 */

// ---------- Utilidades de fecha ----------
const startOf = {
  day: (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0),
  week: (d) => {
    const x = new Date(d);
    const day = (x.getDay() + 6) % 7; // Lunes=0
    x.setDate(x.getDate() - day);
    return new Date(x.getFullYear(), x.getMonth(), x.getDate(), 0, 0, 0, 0);
  },
  month: (d) => new Date(d.getFullYear(), d.getMonth(), 1),
  year: (d) => new Date(d.getFullYear(), 0, 1),
};
const endOf = {
  day: (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999),
  week: (d) => { const s = startOf.week(d); const e = new Date(s); e.setDate(s.getDate() + 6); return endOf.day(e); },
  month: (d) => new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999),
  year: (d) => new Date(d.getFullYear(), 11, 31, 23, 59, 59, 999),
};
function getRange(period, customStart, customEnd) {
  const now = new Date();
  if (period === "Hoy") return [startOf.day(now), endOf.day(now), "hour", "hoy"];
  if (period === "Ayer") { const y = new Date(now); y.setDate(y.getDate() - 1); return [startOf.day(y), endOf.day(y), "hour", "ayer"]; }
  if (period === "Semana") return [startOf.week(now), endOf.week(now), "day", "esta semana"];
  if (period === "Mes") return [startOf.month(now), endOf.month(now), "day", "este mes"];
  if (period === "Año") return [startOf.year(now), endOf.year(now), "month", "este año"];
  const s = customStart ? new Date(customStart) : startOf.day(now);
  const e = customEnd ? new Date(customEnd) : endOf.day(now);
  const days = Math.max(1, Math.ceil((e - s) / (1000 * 60 * 60 * 24)));
  const granularity = days <= 2 ? "hour" : days <= 92 ? "day" : "month";
  return [s, e, granularity, "rango"];
}

// ---------- MOCK ORDERS (solo ventas; costos vienen del Context) ----------
const MOCK_ORDERS = [
  { id:"ORD-1001", estado:"cerrada", total:18.75, propina:2.25, metodoPago:"Efectivo", fechaCierre:new Date().setHours(9,12,0,0),
    items:[{ producto:"Pupusa de queso", categoria:"Porciones", qty:3, precio:0.75 }, { producto:"Café", categoria:"Bebidas", qty:1, precio:1.5 }] },
  { id:"ORD-1002", estado:"cerrada", total:42.1, propina:4.5, metodoPago:"Tarjeta", fechaCierre:new Date().setHours(11,5,0,0),
    items:[{ producto:"Combo desayuno", categoria:"Combos", qty:2, precio:3.99 }, { producto:"Pupusa de queso", categoria:"Porciones", qty:6, precio:0.75 }] },
  { id:"ORD-1003", estado:"cerrada", total:27.0, propina:3.0, metodoPago:"Tarjeta", fechaCierre:new Date().setHours(13,47,0,0),
    items:[{ producto:"Combo almuerzo", categoria:"Combos", qty:1, precio:5.99 }, { producto:"Coca Cola", categoria:"Bebidas", qty:2, precio:1.5 }] },
  { id:"ORD-1004", estado:"cerrada", total:12.4, propina:1.0, metodoPago:"Efectivo", fechaCierre:new Date().setHours(15,10,0,0),
    items:[{ producto:"Pupusa revuelta", categoria:"Porciones", qty:4, precio:0.75 }, { producto:"Agua", categoria:"Bebidas", qty:1, precio:1.0 }] },
  { id:"ORD-1005", estado:"abierta", total:19.2, propina:0, metodoPago:null, fechaCierre:null, items:[{ producto:"Combo cena", categoria:"Combos", qty:1, precio:5.99 }] },
  { id:"ORD-0999", estado:"cerrada", total:31.5, propina:2.0, metodoPago:"Tarjeta", fechaCierre:new Date(Date.now()-86400000).setHours(20,10,0,0),
    items:[{ producto:"Combo desayuno", categoria:"Combos", qty:1, precio:3.99 }] },
];

// Colores para gráficos
const CHART_COLORS = ["#FACC15", "#22C55E", "#60A5FA", "#F472B6", "#A78BFA", "#34D399"];
const COSTS_COLORS = ["#F87171","#FB923C","#FBBF24","#34D399","#60A5FA","#A78BFA"];

// Helpers
const fmtMoney = (n) => `$ ${Number(n || 0).toFixed(2)}`;
const safe = (s) => String(s).replace(/[\\/:*?"<>|]/g, "-");

// Detalle por fecha + producto (ventas)
function detallePorFechaYProducto(ordersCerradas) {
  const map = new Map();
  for (const o of ordersCerradas) {
    const d = new Date(o.fechaCierre); d.setHours(0,0,0,0);
    const fecha = d.toLocaleDateString();
    for (const it of o.items || []) {
      const key = `${fecha}||${it.producto}`;
      const prev = map.get(key) || { fecha, producto: it.producto, cantidad: 0, total: 0 };
      const qty = Number(it.qty || 0), precio = Number(it.precio || 0);
      prev.cantidad += qty; prev.total += qty * precio;
      map.set(key, prev);
    }
  }
  return Array.from(map.values()).sort((a,b)=> new Date(a.fecha)-new Date(b.fecha) || b.cantidad-a.cantidad);
}

// ---------- UI auxiliares ----------
function KPICard({ title, value, subtitle, icon: Icon, gradient, bright = false }) {
  const titleCls = bright ? "text-[11px] uppercase tracking-wide text-black/80" : "text-[11px] uppercase tracking-wide text-white/80";
  const valueCls = bright ? "mt-1 text-2xl font-extrabold text-black" : "mt-1 text-2xl font-extrabold text-white";
  const subCls = bright ? "mt-1 text-xs text-black/70" : "mt-1 text-xs text-white/70";
  const iconWrap = bright ? "p-3 rounded-xl bg-black/10 border border-black/10 text-black/80" : "p-3 rounded-xl bg-white/10 border border-white/10 text-white";
  const ringCls = bright ? "ring-1 ring-black/10" : "ring-1 ring-white/10";
  return (
    <div className={`rounded-2xl p-4 border border-transparent shadow ${ringCls} ${gradient}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className={titleCls}>{title}</p>
          <p className={valueCls}>{value}</p>
          {subtitle && <p className={subCls}>{subtitle}</p>}
        </div>
        {Icon && <div className={iconWrap}><Icon size={22} /></div>}
      </div>
    </div>
  );
}
function Section({ title, children, right }) {
  return (
    <section className="rounded-2xl border border-slate-700 bg-gradient-to-br from-slate-900/90 to-slate-950 p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-yellow-300 font-semibold">{title}</h3>{right}
      </div>
      {children}
    </section>
  );
}
function bucketSales(orders, granularity, start, end) {
  const buckets = [];
  if (granularity === "hour") {
    for (let h = 0; h < 24; h++) buckets.push({ label: `${h}:00`, total: 0 });
    orders.forEach((o) => { const h = new Date(o.fechaCierre).getHours(); buckets[h].total += o.total || 0; });
  } else if (granularity === "day") {
    const cur = new Date(start); cur.setHours(0,0,0,0);
    while (cur <= end) { buckets.push({ label: cur.toLocaleDateString(), key: cur.toDateString(), total: 0 }); cur.setDate(cur.getDate()+1); }
    const map = new Map(buckets.map((b)=>[b.key,b]));
    orders.forEach((o)=>{ const d=new Date(o.fechaCierre); d.setHours(0,0,0,0); const k=d.toDateString(); if(map.has(k)) map.get(k).total += o.total||0; });
  } else {
    const sY=start.getFullYear(), sM=start.getMonth(), eY=end.getFullYear(), eM=end.getMonth();
    for(let y=sY;y<=eY;y++){ const from=y===sY?sM:0, to=y===eY?eM:11; for(let m=from;m<=to;m++) buckets.push({label:`${m+1}/${y}`, key:`${y}-${m}`, total:0}); }
    const map=new Map(buckets.map((b)=>[b.key,b]));
    orders.forEach((o)=>{ const d=new Date(o.fechaCierre); const k=`${d.getFullYear()}-${d.getMonth()}`; if(map.has(k)) map.get(k).total+=o.total||0; });
  }
  return buckets;
}

export default function Reports() {
  const [orders] = useState(MOCK_ORDERS);
  const { costos } = useCostos(); // <— costos reales del contexto
  const [incluirPendientes, setIncluirPendientes] = useState(true); // costos devengado por defecto
  const [filtroMetodo, setFiltroMetodo] = useState("Todos");

  // Período
  const [period, setPeriod] = useState("Hoy");
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");
  const [rangeStart, rangeEnd, granularity, periodLabel] = useMemo(
    () => getRange(period, customStart, customEnd),
    [period, customStart, customEnd]
  );

  

  // ---------- Derivados ----------
  const {
    ventasTotal, ordenesCerradas, ticketPromedio, propinasTotal,
    abiertasCount, abiertasTotal, ventasSerie, pagosPie, topProductos,
    costosTotal, utilidad, margenPct, ventasVsCostos, costosPie
  } = useMemo(() => {
    // Ventas (cerradas en rango)
    let cerradas = orders.filter(
      (o) => o.estado === "cerrada" && o.fechaCierre &&
             new Date(o.fechaCierre) >= rangeStart && new Date(o.fechaCierre) <= rangeEnd
    );
    if (filtroMetodo !== "Todos") cerradas = cerradas.filter((o) => o.metodoPago === filtroMetodo);

    const ventasTotal = cerradas.reduce((acc, o) => acc + (o.total || 0), 0);
    const propinasTotal = cerradas.reduce((acc, o) => acc + (o.propina || 0), 0);
    const ordenesCerradas = cerradas.length;
    const ticketPromedio = ordenesCerradas ? ventasTotal / ordenesCerradas : 0;

    const abiertas = orders.filter((o) => o.estado === "abierta");
    const abiertasTotal = abiertas.reduce((acc, o) => acc + (o.total || 0), 0);

    const ventasSerie = bucketSales(cerradas, granularity, rangeStart, rangeEnd);

    const metodosMap = new Map();
    cerradas.forEach((o) => {
      const k = o.metodoPago || "N/A";
      metodosMap.set(k, (metodosMap.get(k) || 0) + (o.total || 0));
    });
    const pagosPie = Array.from(metodosMap.entries()).map(([name, value]) => ({ name, value }));

    const productQty = new Map();
    cerradas.forEach((o) => (o.items || []).forEach((it) => {
      const k = it.producto;
      productQty.set(k, (productQty.get(k) || 0) + (it.qty || 0));
    }));
    const topProductos = Array.from(productQty.entries())
      .map(([producto, qty]) => ({ producto, qty }))
      .sort((a, b) => b.qty - a.qty)
      .slice(0, 5);

    // COSTOS en rango (desde contexto)
    let costosRango = (costos || []).filter(
      (c) => c.fecha && new Date(c.fecha) >= rangeStart && new Date(c.fecha) <= rangeEnd
    );
    if (!incluirPendientes) costosRango = costosRango.filter((c) => c.pagado);

    const costosTotal = costosRango.reduce((a, c) => a + (Number(c.total) || 0), 0);
    const utilidad = ventasTotal - costosTotal;
    const margenPct = ventasTotal ? (utilidad / ventasTotal) * 100 : 0;

    // Serie Ventas vs Costos (usa etiquetas de ventasSerie)
    const labelFromDate = (date) => {
      const d = new Date(date);
      if (granularity === "day") return new Date(d.getFullYear(), d.getMonth(), d.getDate()).toLocaleDateString();
      if (granularity === "month") return `${d.getMonth() + 1}/${d.getFullYear()}`;
      return `${d.getHours()}:00`;
    };
    const costMap = new Map();
    costosRango.forEach((c) => {
      const lbl = labelFromDate(c.fecha);
      costMap.set(lbl, (costMap.get(lbl) || 0) + (Number(c.total) || 0));
    });
    const ventasVsCostos = ventasSerie.map((v) => ({
      label: v.label,
      ventas: v.total,
      costos: costMap.get(v.label) || 0,
    }));

    // Costos por categoría
    const catMap = new Map();
    costosRango.forEach((c) => {
      const k = c.categoria || "Otros";
      catMap.set(k, (catMap.get(k) || 0) + (Number(c.total) || 0));
    });
    const costosPie = Array.from(catMap.entries()).map(([name, value]) => ({ name, value }));

    return {
      ventasTotal, ordenesCerradas, ticketPromedio, propinasTotal,
      abiertasCount: abiertas.length, abiertasTotal, ventasSerie, pagosPie, topProductos,
      costosTotal, utilidad, margenPct, ventasVsCostos, costosPie
    };
  }, [orders, costos, rangeStart, rangeEnd, granularity, filtroMetodo, incluirPendientes]);

  const metodoOpts = ["Todos", ...new Set(MOCK_ORDERS.map((o) => o.metodoPago).filter(Boolean))];
  const subtitleFecha = period === "Rango"
    ? `${rangeStart.toLocaleDateString()} – ${rangeEnd.toLocaleDateString()}`
    : new Date().toLocaleDateString();
  const granLabel = granularity === "hour" ? "hora" : granularity === "day" ? "día" : "mes";

  // ---------- Exportar: Excel (con Costos reales) ----------
  const exportarExcel = () => {
    let cerradas = orders.filter(
      (o) => o.estado === "cerrada" && o.fechaCierre &&
             new Date(o.fechaCierre) >= rangeStart && new Date(o.fechaCierre) <= rangeEnd
    );
    if (filtroMetodo !== "Todos") cerradas = cerradas.filter((o) => o.metodoPago === filtroMetodo);

    let costosRango = (costos || []).filter(
      (c) => c.fecha && new Date(c.fecha) >= rangeStart && new Date(c.fecha) <= rangeEnd
    );
    if (!incluirPendientes) costosRango = costosRango.filter((c) => c.pagado);

    const wb = XLSX.utils.book_new();

    const wsKPI = XLSX.utils.aoa_to_sheet([
      ["Periodo", periodLabel],
      ["Rango", `${rangeStart.toLocaleDateString()} - ${rangeEnd.toLocaleDateString()}`],
      ["Método de pago (filtro)", filtroMetodo],
      ["Incluir pendientes (costos)", incluirPendientes ? "Sí" : "No"],
      ["Ventas", ventasTotal],
      ["Órdenes cerradas", ordenesCerradas],
      ["Ticket promedio", ticketPromedio],
      ["Propinas", propinasTotal],
      ["Costos", costosTotal],
      ["Utilidad", utilidad],
      ["Margen %", margenPct],
    ]);
    XLSX.utils.book_append_sheet(wb, wsKPI, "KPIs");

    const wsSerie = XLSX.utils.aoa_to_sheet([["Etiqueta", "Ventas"], ...ventasSerie.map((r) => [r.label, r.total])]);
    XLSX.utils.book_append_sheet(wb, wsSerie, "VentasSerie");

    const wsVC = XLSX.utils.aoa_to_sheet([["Etiqueta","Ventas","Costos"], ...ventasVsCostos.map(r=>[r.label, r.ventas, r.costos])]);
    XLSX.utils.book_append_sheet(wb, wsVC, "VentasVsCostos");

    const wsPagos = XLSX.utils.aoa_to_sheet([["Método", "Total"], ...pagosPie.map((p) => [p.name, p.value])]);
    XLSX.utils.book_append_sheet(wb, wsPagos, "MetodosPago");

    const wsCostCat = XLSX.utils.aoa_to_sheet([["Categoría","Total"], ...costosPie.map(p=>[p.name, p.value])]);
    XLSX.utils.book_append_sheet(wb, wsCostCat, "CostosCategoria");

    const detalle = detallePorFechaYProducto(cerradas).map((r) => ({ ...r, total: Number(r.total.toFixed(2)) }));
    const wsDetalle = XLSX.utils.json_to_sheet(detalle, { header: ["fecha", "producto", "cantidad", "total"] });
    XLSX.utils.book_append_sheet(wb, wsDetalle, "VentasDetalle");

    // Detalle de costos real (mapea todos los campos útiles)
    const costosDet = costosRango.map(c => ({
      fecha: c.fecha,
      categoria: c.categoria || "",
      proveedor: c.proveedor || "",
      descripcion: c.descripcion || "",
      metodo: c.metodo || "",
      subTotal: c.subTotal ?? "",
      impuestoPct: c.impuestoPct ?? "",
      total: Number(c.total ?? 0),
      pagado: c.pagado ? "Sí" : "No",
      vence: c.vence || "",
      tieneFactura: c.tieneFactura ? "Sí" : "No",
      numeroFactura: c.numeroFactura || "",
    }));
    const wsCostosDet = XLSX.utils.json_to_sheet(costosDet, {
      header: ["fecha","categoria","proveedor","descripcion","metodo","subTotal","impuestoPct","total","pagado","vence","tieneFactura","numeroFactura"]
    });
    XLSX.utils.book_append_sheet(wb, wsCostosDet, "CostosDetalle");

    const filename = `Reporte_${safe(periodLabel)}_${safe(rangeStart.toLocaleDateString())}_${safe(rangeEnd.toLocaleDateString())}.xlsx`;
    XLSX.writeFile(wb, filename);
  };

  // ---------- Captura exacta → PDF / Imprimir ----------
  const screenRef = useRef(null);
  const exportarPDFExacto = async () => {
    if (!screenRef.current) return;
    const canvas = await html2canvas(screenRef.current, { useCORS: true, scale: 2 });
    const img = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "pt", "a4");
    const pageW = pdf.internal.pageSize.getWidth();
    const pageH = pdf.internal.pageSize.getHeight();
    const imgW = pageW;
    const imgH = (canvas.height * imgW) / canvas.width;
    if (imgH <= pageH) {
      pdf.addImage(img, "PNG", 0, 0, imgW, imgH);
    } else {
      let heightLeft = imgH;
      let position = 0;
      pdf.addImage(img, "PNG", 0, position, imgW, imgH);
      heightLeft -= pageH;
      while (heightLeft > 0) {
        pdf.addPage();
        position = -(imgH - heightLeft);
        pdf.addImage(img, "PNG", 0, position, imgW, imgH);
        heightLeft -= pageH;
      }
    }
    const filename = `Reporte_EXACTO_${safe(periodLabel)}_${safe(rangeStart.toLocaleDateString())}_${safe(rangeEnd.toLocaleDateString())}.pdf`;
    pdf.save(filename);
  };
  const imprimirExacto = async () => {
    if (!screenRef.current) return;
    const canvas = await html2canvas(screenRef.current, { useCORS: true, scale: 2 });
    const dataUrl = canvas.toDataURL("image/png");
    const w = window.open("", "_blank");
    if (!w) return;
    w.document.write(`<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Imprimir</title>
  <style>
    html,body{ margin:0; padding:0; }
    @page { size: auto; margin: 0; }
    img{ width:100vw; height:auto; display:block; }
  </style>
</head>
<body>
  <img src="${dataUrl}" />
  <script>window.onload = () => setTimeout(()=>window.print(), 150);</script>
</body>
</html>`);
    w.document.close();
  };

  return (
    <div ref={screenRef} className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Informes</h2>
          <p className="text-slate-400 text-sm">
            Visión general {period === "Rango" ? "del rango" : `de ${periodLabel}`} · {period === "Rango"
              ? `${rangeStart.toLocaleDateString()} – ${rangeEnd.toLocaleDateString()}`
              : new Date().toLocaleDateString()}
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="text-slate-300 text-sm">Período:</span>
            <select
              className="bg-slate-900 border border-slate-700 text-slate-100 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
            >
              {["Hoy", "Ayer", "Semana", "Mes", "Año", "Rango"].map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
            {period === "Rango" && (
              <>
                <input type="date" value={customStart} onChange={(e) => setCustomStart(e.target.value)}
                       className="bg-slate-900 border border-slate-700 text-slate-100 rounded-lg px-3 py-2" />
                <input type="date" value={customEnd} onChange={(e) => setCustomEnd(e.target.value)}
                       className="bg-slate-900 border border-slate-700 text-slate-100 rounded-lg px-3 py-2" />
              </>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-300 text-sm">Método de pago:</span>
            <select
              className="bg-slate-900 border border-slate-700 text-slate-100 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              value={filtroMetodo}
              onChange={(e) => setFiltroMetodo(e.target.value)}
            >
              {["Todos", ...new Set(MOCK_ORDERS.map((o) => o.metodoPago).filter(Boolean))].map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>

          {granularity !== "hour" && (
            <label className="flex items-center gap-2 text-slate-300 text-sm">
              <input
                type="checkbox"
                checked={incluirPendientes}
                onChange={(e)=>setIncluirPendientes(e.target.checked)}
              />
              Incluir pendientes (costos)
            </label>
          )}

          <div className="flex items-center gap-2">
            <button
              onClick={exportarExcel}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-700 bg-slate-900 text-slate-100 hover:border-yellow-400 hover:shadow-[0_0_0_1px_rgba(250,204,21,0.35)]"
              title="Exportar a Excel"
            >
              <FileSpreadsheet size={16} /> Excel
            </button>
            <button
              onClick={exportarPDFExacto}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-700 bg-slate-900 text-slate-100 hover:border-yellow-400 hover:shadow-[0_0_0_1px_rgba(250,204,21,0.35)]"
              title="Exportar PDF (captura exacta)"
            >
              <FileText size={16} /> PDF
            </button>
            <button
              onClick={imprimirExacto}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-700 bg-slate-900 text-slate-100 hover:border-yellow-400 hover:shadow-[0_0_0_1px_rgba(250,204,21,0.35)]"
              title="Imprimir (captura exacta)"
            >
              <Printer size={16} /> Imprimir
            </button>
          </div>
        </div>
      </div>

      {/* KPI Ventas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl-grid-cols-4 xl:grid-cols-4 gap-4">
        <KPICard title="VENTAS" value={fmtMoney(ventasTotal)} subtitle="Monto total de órdenes cerradas"
                 icon={Banknote} gradient="bg-gradient-to-br from-yellow-400 to-yellow-500" bright />
        <KPICard title="ÓRDENES CERRADAS" value={ordenesCerradas} subtitle="Acumulado"
                 icon={Receipt} gradient="bg-gradient-to-br from-emerald-600 to-emerald-700" />
        <KPICard title="TICKET PROMEDIO" value={fmtMoney(ticketPromedio)} subtitle="Ventas / Órdenes"
                 icon={TrendingUp} gradient="bg-gradient-to-br from-blue-600 to-blue-700" />
        <KPICard title="PROPINAS" value={fmtMoney(propinasTotal)} subtitle="Solo órdenes cerradas"
                 icon={Percent} gradient="bg-gradient-to-br from-pink-600 to-pink-700" />
      </div>

      {/* KPI Costos */}
      {granularity !== "hour" && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <KPICard
            title="COSTOS"
            value={fmtMoney(costosTotal)}
            subtitle={incluirPendientes ? "Base devengado" : "Base caja (pagados)"}
            icon={Receipt}
            gradient="bg-gradient-to-br from-rose-600 to-rose-700"
          />
          <KPICard
            title="UTILIDAD"
            value={fmtMoney(utilidad)}
            subtitle="Ventas - Costos"
            icon={TrendingUp}
            gradient="bg-gradient-to-br from-violet-600 to-violet-700"
          />
          <KPICard
            title="MARGEN %"
            value={`${margenPct.toFixed(1)}%`}
            subtitle="Utilidad / Ventas"
            icon={LineChartIcon}
            gradient="bg-gradient-to-br from-indigo-600 to-indigo-700"
          />
        </div>
      )}

      {/* Charts - fila 1 */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <Section title={`Ventas por ${granLabel} (${periodLabel})`} right={<LineChartIcon className="text-yellow-300" size={18} />}>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ventasSerie} margin={{ top: 8, right: 8, bottom: 8, left: 8 }}>
                <XAxis dataKey="label" stroke="#94a3b8" tickLine={false} axisLine={{ stroke: "#334155" }} />
                <YAxis stroke="#94a3b8" tickLine={false} axisLine={{ stroke: "#334155" }} tickFormatter={(v) => `$${v}`} />
                <Tooltip
                  contentStyle={{ background: "#0f172a", border: "1px solid #334155" }}
                  labelStyle={{ color: "#e2e8f0" }}
                  itemStyle={{ color: "#e2e8f0" }}
                  formatter={(v) => [`$${Number(v).toFixed(2)}`, "Ventas"]}
                />
                <Bar dataKey="total" fill="#FACC15" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Section>

        <Section title={`Ventas por método de pago (${periodLabel})`} right={<CreditCard className="text-yellow-300" size={18} />}>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pagosPie} dataKey="value" nameKey="name" outerRadius={80} innerRadius={40}>
                  {pagosPie.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background: "#0f172a", border: "1px solid #334155" }}
                  labelStyle={{ color: "#e2e8f0" }}
                  itemStyle={{ color: "#e2e8f0" }}
                  formatter={(v, n) => [`$${Number(v).toFixed(2)}`, n]}
                />
                <Legend wrapperStyle={{ color: "#e2e8f0" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Section>

        <Section title="Órdenes abiertas ahora" right={<CircleDollarSign className="text-yellow-300" size={18} />}>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-slate-700 p-3 bg-slate-900/60">
              <p className="text-xs text-slate-300">Cantidad</p>
              <p className="text-xl font-bold text-white">{abiertasCount}</p>
            </div>
            <div className="rounded-2xl border border-slate-700 p-3 bg-slate-900/60">
              <p className="text-xs text-slate-300">Monto estimado</p>
              <p className="text-xl font-bold text-white">{fmtMoney(abiertasTotal)}</p>
            </div>
          </div>
          <p className="mt-2 text-xs text-slate-400">*No se suman a Ventas hasta cerrar/cobrar.</p>
        </Section>
      </div>

      {/* Charts - fila 2 */}
      {granularity !== "hour" && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <Section title={`Ventas vs Costos por ${granLabel} (${periodLabel})`}>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ventasVsCostos} margin={{ top: 8, right: 8, bottom: 8, left: 8 }}>
                  <XAxis dataKey="label" stroke="#94a3b8" tickLine={false} axisLine={{ stroke: "#334155" }} />
                  <YAxis stroke="#94a3b8" tickLine={false} axisLine={{ stroke: "#334155" }} tickFormatter={(v) => `$${v}`} />
                  <Tooltip
                    contentStyle={{ background: "#0f172a", border: "1px solid #334155" }}
                    labelStyle={{ color: "#e2e8f0" }}
                    itemStyle={{ color: "#e2e8f0" }}
                    formatter={(v, n) => [`$${Number(v).toFixed(2)}`, n]}
                  />
                  <Legend wrapperStyle={{ color: "#e2e8f0" }} />
                  <Bar dataKey="ventas" name="Ventas" fill="#FACC15" radius={[6,6,0,0]} />
                  <Bar dataKey="costos" name="Costos" fill="#F43F5E" radius={[6,6,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Section>

          <Section title={`Costos por categoría (${periodLabel})`}>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={costosPie} dataKey="value" nameKey="name" outerRadius={80} innerRadius={40}>
                    {costosPie.map((entry, index) => (
                      <Cell key={`cell-cost-${index}`} fill={COSTS_COLORS[index % COSTS_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ background: "#0f172a", border: "1px solid #334155" }}
                    labelStyle={{ color: "#e2e8f0" }}
                    itemStyle={{ color: "#e2e8f0" }}
                    formatter={(v, n) => [`$${Number(v).toFixed(2)}`, n]}
                  />
                  <Legend wrapperStyle={{ color: "#e2e8f0" }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Section>
        </div>
      )}

      {/* Top productos */}
      <Section title={`Top productos (${periodLabel})`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-slate-300 text-xs uppercase">
                <th className="py-2 border-b border-slate-700">Producto</th>
                <th className="py-2 border-b border-slate-700">Cantidad</th>
              </tr>
            </thead>
            <tbody>
              {topProductos.map((p) => (
                <tr key={p.producto} className="text-slate-100">
                  <td className="py-2 border-b border-slate-800">{p.producto}</td>
                  <td className="py-2 border-b border-slate-800">{p.qty}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>
    </div>
  );
}
