import React, { useState, useEffect } from "react";
import { Pencil } from "lucide-react";

const ImpuestosForm = () => {
  const [editando, setEditando] = useState(false);
  const [mostrarGuardado, setMostrarGuardado] = useState(false);
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);

  const [config, setConfig] = useState({
    activarPropina: false,
    propina: 10,
    activarImpuesto: false,
    impuesto: 13,
  });

  // Placeholder para simular datos desde backend
  const [valoresActuales, setValoresActuales] = useState({
    activarPropina: true,
    propina: 10,
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
    // Aquí luego se actualizará el backend con `config`
    setValoresActuales(config); // simulación
    setMostrarGuardado(true);
    setEditando(false);
    setMostrarConfirmacion(false);
    setTimeout(() => setMostrarGuardado(false), 3000);
  };

  const cancelarGuardar = () => {
    setMostrarConfirmacion(false);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
      {/* Formulario editable */}
      <div className="max-w-md mx-auto bg-[#0e1320] p-6 border border-yellow-400 rounded-xl text-white">
        <h2 className="text-2xl font-bold text-yellow-400 mb-4 flex items-center gap-2">
          <span>💰</span> Propinas e Impuestos
        </h2>

        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center">
              <label className="font-medium">Activar propina automática</label>
              {!editando && (
                <button
                  onClick={() => setEditando(true)}
                  className="text-yellow-400 hover:text-yellow-300"
                >
                  <Pencil size={18} />
                </button>
              )}
            </div>
            <div className="mt-1 flex items-center gap-2">
              <input
                type="checkbox"
                checked={config.activarPropina}
                disabled={!editando}
                onChange={(e) => handleChange("activarPropina", e.target.checked)}
                className="form-checkbox h-4 w-4 text-yellow-500"
              />
              <input
                type="number"
                disabled={!editando || !config.activarPropina}
                value={config.propina}
                onChange={(e) => handleChange("propina", e.target.value)}
                className="px-3 py-1 bg-green-100 text-black rounded-md w-24"
              />
              <span>%</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center">
              <label className="font-medium">Activar impuesto por servicio</label>
              {!editando && (
                <button
                  onClick={() => setEditando(true)}
                  className="text-yellow-400 hover:text-yellow-300"
                >
                  <Pencil size={18} />
                </button>
              )}
            </div>
            <div className="mt-1 flex items-center gap-2">
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
          </div>

          {editando && !mostrarConfirmacion && (
            <button
              onClick={handleGuardar}
              className="mt-4 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-6 py-2 rounded-md"
            >
              Guardar configuración
            </button>
          )}

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
      </div>

      {/* Panel lateral con valores actuales */}
      <div className="bg-[#0e1320] p-6 border border-yellow-400 rounded-xl text-white">
        <h3 className="text-xl font-bold text-yellow-300 mb-4">Valores actuales</h3>
        <p className="mb-2">Propina automática: {valoresActuales.activarPropina ? `✅ Sí (${valoresActuales.propina}%)` : "❌ No"}</p>
        <p>Impuesto por servicio: {valoresActuales.activarImpuesto ? `✅ Sí (${valoresActuales.impuesto}%)` : "❌ No"}</p>
      </div>
    </div>
  );
};

export default ImpuestosForm;
