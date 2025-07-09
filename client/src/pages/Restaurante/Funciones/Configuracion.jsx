import React, { useState } from "react";
import { Input } from "@/components/ui/Input.jsx";

export default function Parametros() {
  const [modoEdicion, setModoEdicion] = useState(false);
  const [formulario, setFormulario] = useState({
    nombre: "Restaurante 01",
    sucursal: "Chaparral",
    direccion:
      "Polígono 33B, Calle Nacional # 28, Cantón El Capulín, Colón, La Libertad",
    mesas: 6,
    idioma: "es",
    zona: "America/El_Salvador",
    apertura: "08:00",
    cierre: "21:00",
    margen: 30,
  });

  const handleChange = (e) =>
    setFormulario({ ...formulario, [e.target.name]: e.target.value });

  const activarEdicion = () => setModoEdicion(true);
  const guardarCambios = () => {
    setModoEdicion(false);
    console.log("Guardado:", formulario);
    // Aquí puedes llamar a tu API para guardar
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
      {/* Columna izquierda - Formulario */}
      <div className="bg-[#0e1320] p-6 rounded-xl shadow-md border border-yellow-400">
        <h2 className="text-2xl font-bold text-yellow-400 mb-2 flex items-center gap-2">
          🏢 Parámetros del Restaurante
        </h2>
        <p className="text-white mb-3">
          Visualiza o modifica la configuración general del sistema.
        </p>

        <form className="space-y-3">
          {/* Nombre */}
          <div>
            <label className="block text-sm font-semibold text-yellow-300 mb-1">
              Nombre del restaurante
            </label>
            <input
              type="text"
              name="nombre"
              value={formulario.nombre}
              onChange={handleChange}
              disabled={!modoEdicion}
              className="w-full px-4 py-1.5 bg-green-100 text-black rounded-md"
            />
          </div>

          {/* Sucursal */}
          <div>
            <label className="block text-sm font-semibold text-yellow-300 mb-1">
              Sucursal
            </label>
            <input
              type="text"
              name="sucursal"
              value={formulario.sucursal}
              onChange={handleChange}
              disabled={!modoEdicion}
              className="w-full px-4 py-1.5 bg-green-100 text-black rounded-md"
            />
          </div>

          {/* Dirección */}
          <div>
            <label className="block text-sm font-semibold text-yellow-300 mb-1">
              Dirección
            </label>
            <input
              type="text"
              name="direccion"
              value={formulario.direccion}
              onChange={handleChange}
              disabled={!modoEdicion}
              className="w-full px-4 py-1.5 bg-green-100 text-black rounded-md"
            />
          </div>

          {/* Número de mesas */}
          <div>
            <label className="block text-sm font-semibold text-yellow-300 mb-1">
              Número de mesas
            </label>
            <input
              type="number"
              name="mesas"
              value={formulario.mesas}
              onChange={handleChange}
              disabled={!modoEdicion}
              className="w-full px-4 py-1.5 bg-green-100 text-black rounded-md"
            />
          </div>

          {/* Idioma y zona horaria */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-yellow-300 mb-1">
                Idioma
              </label>
              <select
                name="idioma"
                value={formulario.idioma}
                onChange={handleChange}
                disabled={!modoEdicion}
                className="w-full px-4 py-1.5 bg-green-100 text-black rounded-md"
              >
                <option value="es">Español</option>
                <option value="en">Inglés</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-yellow-300 mb-1">
                Zona horaria
              </label>
              <select
                name="zona"
                value={formulario.zona}
                onChange={handleChange}
                disabled={!modoEdicion}
                className="w-full px-4 py-1.5 bg-green-100 text-black rounded-md"
              >
                <option value="America/El_Salvador">America/El_Salvador</option>
                <option value="America/Los_Angeles">America/Los_Angeles</option>
                <option value="UTC">UTC</option>
              </select>
            </div>
          </div>

          {/* Horario */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-yellow-300 mb-1">
                Horario de apertura
              </label>
              <input
                type="time"
                name="apertura"
                value={formulario.apertura}
                onChange={handleChange}
                disabled={!modoEdicion}
                className="w-full px-4 py-1.5 bg-green-100 text-black rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-yellow-300 mb-1">
                Horario de cierre
              </label>
              <input
                type="time"
                name="cierre"
                value={formulario.cierre}
                onChange={handleChange}
                disabled={!modoEdicion}
                className="w-full px-4 py-1.5 bg-green-100 text-black rounded-md"
              />
            </div>
          </div>

          {/* Margen */}
          <div>
            <label className="block text-sm font-semibold text-yellow-300 mb-1">
              Margen de ganancia general (%)
            </label>
            <input
              type="number"
              name="margen"
              value={formulario.margen}
              onChange={handleChange}
              disabled={!modoEdicion}
              className="w-full px-4 py-1.5 bg-green-100 text-black rounded-md"
            />
          </div>

          {/* Botón */}
          <div className="pt-3">
            {!modoEdicion ? (
              <button
                type="button"
                onClick={activarEdicion}
                className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-6 py-1.5 rounded-md transition duration-200"
              >
                Modificar parámetros
              </button>
            ) : (
              <button
                type="button"
                onClick={guardarCambios}
                className="bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-1.5 rounded-md transition duration-200"
              >
                Guardar cambios
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Columna derecha - Vacía (opcional) */}
      <div className="bg-[#0e1320] p-6 rounded-xl border border-yellow-400 text-white hidden lg:block">
        <h3 className="text-xl font-bold text-yellow-300 mb-2">
          Vista previa o ayuda
        </h3>
        <p className="text-sm">
          Aquí puedes mostrar el resumen de los parámetros o sugerencias para el sistema.
        </p>
      </div>
    </div>
  );
}
