import React, { useEffect, useState } from "react";
import { LogOut, XCircle } from "lucide-react";

const Turnos = () => {
  const [horaActual, setHoraActual] = useState(new Date());

  const usuarioActual = {
    id: "admin_001",
    nombre: "Luis Contreras",
    rol: "gerente",
  };

  const [empleados, setEmpleados] = useState([
    {
      id: "emp_001",
      nombre: "Juan Pérez",
      rol: "mesero",
      estado: "activo",
      historial: [
        { accion: "Entrada", fecha: "2025-07-12", hora: "08:00 AM" },
      ],
    },
    {
      id: "emp_002",
      nombre: "Ana Martínez",
      rol: "cocinera",
      estado: "en_descanso",
      historial: [
        { accion: "Entrada", fecha: "2025-07-12", hora: "08:30 AM" },
        { accion: "Inicio descanso", fecha: "2025-07-12", hora: "10:15 AM" },
      ],
    },
    {
      id: "emp_003",
      nombre: "Carlos López",
      rol: "mesero",
      estado: "terminado",
      historial: [
        { accion: "Entrada", fecha: "2025-07-11", hora: "09:00 AM" },
        { accion: "Salida", fecha: "2025-07-11", hora: "17:10 PM" },
      ],
    },
  ]);

  // Filtros
  const [filtroNombre, setFiltroNombre] = useState("");
  const [filtroRol, setFiltroRol] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("");

  useEffect(() => {
    const interval = setInterval(() => setHoraActual(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const handleForzarSalida = (idEmpleado) => {
    const nuevos = empleados.map((emp) => {
      if (emp.id === idEmpleado && emp.estado !== "terminado") {
        return {
          ...emp,
          estado: "terminado",
          historial: [
            {
              accion: "Forzado por gerente",
              fecha: horaActual.toLocaleDateString(),
              hora: horaActual.toLocaleTimeString(),
            },
            ...emp.historial,
          ],
        };
      }
      return emp;
    });

    setEmpleados(nuevos);
    console.log("Salida forzada para:", idEmpleado);
  };

  const obtenerEntrada = (historial) =>
    historial.find((h) => h.accion === "Entrada");

  const obtenerSalida = (historial) =>
    historial.find(
      (h) => h.accion === "Salida" || h.accion === "Forzado por gerente"
    );

  const calcularHorasTrabajadas = (historial) => {
    const entrada = obtenerEntrada(historial);
    const salida = obtenerSalida(historial);
    if (!entrada || !salida) return "En curso...";

    const fechaEntrada = new Date(`${entrada.fecha} ${entrada.hora}`);
    const fechaSalida = new Date(`${salida.fecha} ${salida.hora}`);
    const ms = fechaSalida - fechaEntrada;
    if (isNaN(ms)) return "Error";

    const horas = Math.floor(ms / (1000 * 60 * 60));
    const minutos = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    return `${horas}h ${minutos}m`;
  };

  const limpiarFiltros = () => {
    setFiltroNombre("");
    setFiltroRol("");
    setFiltroEstado("");
  };

  const empleadosFiltrados = empleados.filter((emp) => {
    const coincideNombre = emp.nombre
      .toLowerCase()
      .includes(filtroNombre.toLowerCase());
    const coincideRol = filtroRol ? emp.rol === filtroRol : true;
    const coincideEstado = filtroEstado ? emp.estado === filtroEstado : true;
    return coincideNombre && coincideRol && coincideEstado;
  });

  return (
    <div className="max-w-7xl mx-auto p-6 text-white">
      <div className="bg-[#0e1320] border border-yellow-400 rounded-xl p-6 shadow">
        <h2 className="text-2xl font-bold text-yellow-400 mb-4 text-center">
          Control de Turnos Activos
        </h2>

        {/* FILTROS */}
        <div className="flex flex-wrap gap-4 mb-6 items-center">
          <input
            type="text"
            placeholder="Buscar por nombre"
            className="px-3 py-2 rounded-md bg-white text-black w-60"
            value={filtroNombre}
            onChange={(e) => setFiltroNombre(e.target.value)}
          />

          <select
            value={filtroRol}
            onChange={(e) => setFiltroRol(e.target.value)}
            className="px-3 py-2 rounded-md bg-white text-black"
          >
            <option value="">Todos los roles</option>
            <option value="mesero">Mesero</option>
            <option value="cocinera">Cocinera</option>
          </select>

          <select
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
            className="px-3 py-2 rounded-md bg-white text-black"
          >
            <option value="">Todos los estados</option>
            <option value="activo">Activo</option>
            <option value="en_descanso">En descanso</option>
            <option value="terminado">Terminado</option>
          </select>

          <button
            onClick={limpiarFiltros}
            className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md"
          >
            <XCircle size={16} /> Limpiar filtros
          </button>
        </div>

        {/* TABLA */}
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-gray-700 text-left">
            <thead className="bg-gray-800 text-yellow-300">
              <tr>
                <th className="px-4 py-2">Empleado</th>
                <th className="px-4 py-2">Rol</th>
                <th className="px-4 py-2">Estado</th>
                <th className="px-4 py-2">Entrada</th>
                <th className="px-4 py-2">Salida</th>
                <th className="px-4 py-2">Total</th>
                <th className="px-4 py-2">Acción</th>
              </tr>
            </thead>
            <tbody>
              {empleadosFiltrados.map((emp) => {
                const entrada = obtenerEntrada(emp.historial);
                const salida = obtenerSalida(emp.historial);
                return (
                  <tr key={emp.id} className="border-t border-gray-700">
                    <td className="px-4 py-2 font-medium">{emp.nombre}</td>
                    <td className="px-4 py-2 capitalize">{emp.rol}</td>
                    <td className="px-4 py-2 capitalize">
                      {emp.estado === "activo" ? (
                        <span className="text-green-400 font-semibold">Activo</span>
                      ) : emp.estado === "en_descanso" ? (
                        <span className="text-yellow-400 font-semibold">En descanso</span>
                      ) : (
                        <span className="text-gray-400">Terminado</span>
                      )}
                    </td>
                    <td className="px-4 py-2">{entrada?.hora || "--"}</td>
                    <td className="px-4 py-2">{salida?.hora || "--"}</td>
                    <td className="px-4 py-2">
                      {calcularHorasTrabajadas(emp.historial)}
                    </td>
                    <td className="px-4 py-2">
                      {usuarioActual.rol === "gerente" &&
                      emp.estado !== "terminado" ? (
                        <button
                          onClick={() => handleForzarSalida(emp.id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md flex items-center gap-1"
                        >
                          <LogOut size={16} /> Forzar salida
                        </button>
                      ) : (
                        <span className="text-gray-500 text-sm">Turno cerrado</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="mt-6 text-sm text-right text-gray-400">
          Última actualización: {horaActual.toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
};

export default Turnos;
