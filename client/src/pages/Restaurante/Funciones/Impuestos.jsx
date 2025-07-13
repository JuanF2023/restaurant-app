import React, { useState } from "react";
import { Pencil, Info } from "lucide-react";

const ImpuestosForm = () => {
  const [editando, setEditando] = useState(false);
  const [mostrarGuardado, setMostrarGuardado] = useState(false);
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);

  const [config, setConfig] = useState({
    propina: 0,
    activarImpuesto: false,
    impuesto: 13,
  });

  const [valoresActuales, setValoresActuales] = useState({
    propina: 0,
    activarImpuesto: true,
    impuesto: 13,
  });

  const handleChange = (field, value) => {
    setConfig((prev) => ({ ...prev, [field]: value }));
  };

  const handleGuardar = () => {
    setMostrarConfirmacion(true);
  };

  const confirmarGuardar = () => {
    setValoresActuales(config);
    setMostrarGuardado(true);
    setEditando(false);
    setMostrarConfirmacion(false);
    setTimeout(() => setMostrarGuardado(false), 3000);
  };

  const cancelarGuardar = () => {
    setMostrarConfirmacion(false);
  };

  const cancelarCambios = () => {
    setConfig(valoresActuales);
    setEditando(false);
  };

  const cambiosPendientes = JSON.stringify(config) !== JSON.stringify(valoresActuales);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
      {/* Panel de configuración */}
      <div className="max-w-md mx-auto bg-[#0e1320] p-6 border border-yellow-400 rounded-xl text-white shadow-md">
        <h2 className="text-2xl font-bold text-yellow-400 mb-4 flex items-center gap-2">
          <span>💰</span> Propinas e Impuestos
        </h2>

        {/* BLOQUE AGRUPADO: PROPINA */}
        <div className="bg-[#111827] p-4 rounded-lg border border-yellow-400 space-y-4 mb-6">
          <div className="flex justify-between items-center">
            <label className="font-medium flex items-center gap-1">
              Seleccionar propina sugerida
              <Info size={14} title="Esta propina se sugiere en el recibo, no se aplica automáticamente" />
            </label>
            {!editando && (
              <button
                onClick={() => setEditando(true)}
                className="text-yellow-400 hover:text-yellow-300"
              >
                <Pencil size={18} />
              </button>
            )}
          </div>

          <div>
            <label className="text-sm font-semibold block mb-1">Porcentaje:</label>
            <div className="flex flex-wrap gap-2">
              {[10, 15, 20].map((percent) => (
                <button
                  key={percent}
                  disabled={!editando}
                  onClick={() => handleChange("propina", percent)}
                  className={`px-4 py-2 rounded-xl font-semibold transition border shadow-sm ${
                    config.propina === percent
                      ? "bg-yellow-400 text-black border-yellow-500 ring-2 ring-yellow-300"
                      : "bg-white text-black border-gray-300 hover:bg-yellow-100"
                  }`}
                >
                  {percent}%
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold block mb-1">Monto rápido:</label>
            <div className="flex flex-wrap gap-2">
              {[0.5, 1, 2, 3].map((valor) => (
                <button
                  key={valor}
                  disabled={!editando}
                  onClick={() => handleChange("propina", valor)}
                  className={`px-4 py-2 rounded-xl font-semibold transition border shadow-sm ${
                    config.propina === valor
                      ? "bg-yellow-400 text-black border-yellow-500 ring-2 ring-yellow-300"
                      : "bg-white text-black border-gray-300 hover:bg-yellow-100"
                  }`}
                >
                  ${valor.toFixed(2)}
                </button>
              ))}
            </div>
          </div>

          <div className="text-center mt-2">
            <button
              disabled={!editando}
              onClick={() => handleChange("propina", 0)}
              className={`px-6 py-2 rounded-xl font-semibold transition border shadow-sm ${
                config.propina === 0
                  ? "bg-yellow-400 text-black border-yellow-500 ring-2 ring-yellow-300"
                  : "bg-white text-black border-gray-300 hover:bg-yellow-100"
              }`}
            >
              Sin propina
            </button>
          </div>
        </div>

        {/* BLOQUE AGRUPADO: IMPUESTO */}
        <div className="bg-[#111827] p-4 rounded-lg border border-yellow-400 space-y-4 mb-6">
          <div className="flex justify-between items-center">
            <label className="font-medium flex items-center gap-1">
              Configuración de impuesto por servicio
              <Info size={14} title="El impuesto se aplicará sobre el total de la orden." />
            </label>
            {!editando && (
              <button
                onClick={() => setEditando(true)}
                className="text-yellow-400 hover:text-yellow-300"
              >
                <Pencil size={18} />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={config.activarImpuesto}
              disabled={!editando}
              onChange={(e) => handleChange("activarImpuesto", e.target.checked)}
              className="form-checkbox h-4 w-4 text-yellow-500"
            />
            <input
              type="number"
              disabled={!editando || !config.activarImpuesto}
              value={config.impuesto}
              onChange={(e) => handleChange("impuesto", e.target.value)}
              className="px-3 py-1 bg-green-100 text-black rounded-md w-24"
            />
            <span>%</span>
          </div>

          <div className="text-center mt-2">
            <button
              disabled={!editando}
              onClick={() =>
                setConfig((prev) => ({
                  ...prev,
                  activarImpuesto: false,
                  impuesto: 0,
                }))
              }
              className={`px-6 py-2 rounded-xl font-semibold transition border shadow-sm ${
                !config.activarImpuesto
                  ? "bg-yellow-400 text-black border-yellow-500 ring-2 ring-yellow-300"
                  : "bg-white text-black border-gray-300 hover:bg-yellow-100"
              }`}
            >
              Sin impuesto
            </button>
          </div>
        </div>

        {/* GUARDAR + CANCELAR */}
        {editando && !mostrarConfirmacion && (
          <div className="flex gap-3 mt-6">
            <button
              onClick={handleGuardar}
              disabled={!cambiosPendientes}
              className={`px-6 py-2 font-semibold rounded-md transition ${
                cambiosPendientes
                  ? "bg-yellow-400 hover:bg-yellow-500 text-black"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              Guardar configuración
            </button>

            <button
              onClick={cancelarCambios}
              className="px-6 py-2 font-semibold rounded-md bg-gray-500 hover:bg-gray-600 text-white transition"
            >
              Cancelar
            </button>
          </div>
        )}

        {/* CONFIRMACIÓN */}
        {mostrarConfirmacion && (
          <div className="bg-yellow-100 text-yellow-900 border border-yellow-400 p-3 rounded-md mt-4">
            <p className="font-medium">¿Estás seguro de que deseas guardar esta configuración?</p>
            <p className="text-sm mt-1">Esto modificará los cálculos de las facturas en el sistema.</p>
            <div className="mt-3 flex gap-3">
              <button
                onClick={confirmarGuardar}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded-md"
              >
                Confirmar
              </button>
              <button
                onClick={cancelarGuardar}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded-md"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}

        {mostrarGuardado && (
          <p className="mt-2 text-green-400 text-sm font-medium">
            ✅ Cambios guardados correctamente
          </p>
        )}
      </div>

      {/* PANEL VALORES ACTUALES */}
      <div className="bg-[#0e1320] p-6 border border-yellow-400 rounded-xl text-white shadow-md">
        <h3 className="text-xl font-bold text-yellow-300 mb-4">Valores actuales</h3>
        <p className="mb-2">
          Propina seleccionada:{" "}
          {valoresActuales.propina > 0 ? (
            valoresActuales.propina <= 1 ? (
              `$${valoresActuales.propina.toFixed(2)}`
            ) : (
              `${valoresActuales.propina}%`
            )
          ) : (
            <span className="text-red-400">❌ No</span>
          )}
        </p>
        <p>
          Impuesto por servicio:{" "}
          {valoresActuales.activarImpuesto ? (
            <span className="text-green-400">✅ Sí ({valoresActuales.impuesto}%)</span>
          ) : (
            <span className="text-red-400">❌ No</span>
          )}
        </p>
      </div>
    </div>
  );
};

export default ImpuestosForm;
