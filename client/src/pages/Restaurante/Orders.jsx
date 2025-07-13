// Orders.jsx actualizado con estructura mock y lógica completa
import React, { useState, useEffect } from "react";
import { Search, RefreshCcw, DoorOpen, Printer } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Orders = () => {
  const navigate = useNavigate();

  const [busqueda, setBusqueda] = useState("");
  const [estadoFiltro, setEstadoFiltro] = useState("abierta");
  const [ordenes, setOrdenes] = useState([]);

  // Mock estructurado para futura conexión con backend
  useEffect(() => {
    const mockData = [
      {
        id: "ORD001",
        mesa: "1",
        estado: "abierta",
        pagada: false,
        total: 18.75,
        fecha: "2025-07-12T09:45:00",
        usuario: "Juan Pérez"
      },
      {
        id: "ORD002",
        mesa: "2",
        estado: "cerrada",
        pagada: true,
        total: 27.50,
        fecha: "2025-07-11T17:10:00",
        usuario: "Ana Martínez"
      },
      {
        id: "ORD003",
        mesa: "3",
        estado: "abierta",
        pagada: false,
        total: 13.90,
        fecha: "2025-07-12T10:30:00",
        usuario: "Carlos López"
      }
    ];
    setOrdenes(mockData);
  }, []);

  const limpiarFiltros = () => {
    setBusqueda("");
    setEstadoFiltro("abierta");
  };

  const ordenesFiltradas = ordenes.filter((orden) => {
    const coincideBusqueda = orden.mesa.toLowerCase().includes(busqueda.toLowerCase());
    const coincideEstado = estadoFiltro === "todas" || orden.estado === estadoFiltro;
    return coincideBusqueda && coincideEstado;
  });

  const handleEntrarOrden = (ordenId) => {
    navigate(`/orden/${ordenId}`); // Esto apunta a OrderBuilder.jsx con ID
  };

  return (
    <div className="p-6 text-white max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-white mb-1">Órdenes</h1>
      <p className="text-sm text-gray-300 mb-4">Gestión de órdenes abiertas y cerradas.</p>

      {/* Filtros */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Buscar por mesa"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="px-3 py-1 rounded text-black w-48"
          />
          <select
            value={estadoFiltro}
            onChange={(e) => setEstadoFiltro(e.target.value)}
            className="px-3 py-1 rounded text-black"
          >
            <option value="todas">Todos los estados</option>
            <option value="abierta">Abiertas</option>
            <option value="cerrada">Cerradas</option>
          </select>
          <button
            onClick={limpiarFiltros}
            className="bg-gray-600 hover:bg-gray-700 px-3 py-1 rounded text-white text-sm flex items-center gap-1"
          >
            <RefreshCcw size={14} /> Limpiar filtros
          </button>
        </div>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto border border-yellow-500 rounded-xl">
        <table className="min-w-full text-left">
          <thead className="bg-[#101626] text-yellow-400 text-sm">
            <tr>
              <th className="px-4 py-2">Orden #</th>
              <th className="px-4 py-2">Mesa</th>
              <th className="px-4 py-2">Estado</th>
              <th className="px-4 py-2">Pago</th>
              <th className="px-4 py-2">Total</th>
              <th className="px-4 py-2">Fecha</th>
              <th className="px-4 py-2">Usuario</th>
              <th className="px-4 py-2">Acción</th>
            </tr>
          </thead>
          <tbody>
            {ordenesFiltradas.map((orden) => (
              <tr key={orden.id} className="border-b border-gray-700 hover:bg-[#1c2233]">
                <td className="px-4 py-2">{orden.id}</td>
                <td className="px-4 py-2">{orden.mesa}</td>
                <td className="px-4 py-2 capitalize">{orden.estado}</td>
                <td className="px-4 py-2">{orden.pagada ? "Pagada" : "Pendiente"}</td>
                <td className="px-4 py-2">${orden.total.toFixed(2)}</td>
                <td className="px-4 py-2">{new Date(orden.fecha).toLocaleString()}</td>
                <td className="px-4 py-2">{orden.usuario}</td>
                <td className="px-4 py-2">
                  <div className="flex gap-2">
                    {orden.estado === "abierta" ? (
                      <button
                        onClick={() => handleEntrarOrden(orden.id)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-sm flex items-center gap-1"
                      >
                        <DoorOpen size={14} /> Entrar
                      </button>
                    ) : (
                      <span className="text-gray-400 italic text-sm">Cerrada</span>
                    )}
                    <button
                      className="bg-yellow-400 hover:bg-yellow-500 text-black px-3 py-1 rounded-md text-sm flex items-center gap-1 shadow-md"
                    >
                      <Printer size={14} /> Recibo
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Estadísticas */}
      <div className="mt-4 text-sm text-gray-300">
        <p>Total de órdenes: {ordenesFiltradas.length}</p>
        <p>
          Total del día: $
          {ordenesFiltradas
            .filter((o) => new Date(o.fecha).toDateString() === new Date().toDateString())
            .reduce((sum, o) => sum + o.total, 0)
            .toFixed(2)}
        </p>
      </div>
    </div>
  );
};

export default Orders;
