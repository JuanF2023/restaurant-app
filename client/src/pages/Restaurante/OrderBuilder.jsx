import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Printer, Trash2, Minus, Plus, Search } from "lucide-react";

const productosPorCategoria = {
  Combos: [
    { id: 1, nombre: "Combo desayuno", precio: 3.99 },
    { id: 2, nombre: "Combo almuerzo", precio: 5.99 },
  ],
  Pupusas: [
    { id: 3, nombre: "Pupusa de queso", precio: 0.5 },
    { id: 4, nombre: "Pupusa revuelta", precio: 0.75 },
    { id: 9, nombre: "Pupusa de frijol con queso", precio: 0.6 },
  ],
  Bebidas: [
    { id: 5, nombre: "Coca Cola", precio: 1.5 },
    { id: 6, nombre: "Jugo de naranja", precio: 1.25 },
  ],
  Porciones: [
    { id: 7, nombre: "Curtido adicional", precio: 0.25 },
    { id: 8, nombre: "Salsa adicional", precio: 0.25 },
  ],
};

const OrderBuilder = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const estado = location.state || {};

  const mesaId = estado.mesaId || localStorage.getItem("mesaId") || "-";
  const tipoOrden = estado.tipoOrden || localStorage.getItem("tipoOrden") || "General";
  const cantidad = parseInt(estado.cantidad || localStorage.getItem("cantidad") || 1);

  const [orden, setOrden] = useState(Array(cantidad).fill([]));
  const [personaActual, setPersonaActual] = useState(0);
  const [ordenId, setOrdenId] = useState(null);
  const [enviados, setEnviados] = useState([]);
  const [search, setSearch] = useState("");
  const [cantidadesTemp, setCantidadesTemp] = useState({});

  const agregarProducto = (producto, cantidad = 1) => {
    if (ordenId) return;
    const nuevaOrden = [...orden];
    nuevaOrden[personaActual] = [...nuevaOrden[personaActual], { ...producto, cantidad }];
    setOrden(nuevaOrden);
    setCantidadesTemp((prev) => ({ ...prev, [producto.id]: 1 }));
  };

  const cambiarCantidad = (personaIdx, index, delta) => {
    const nuevaOrden = [...orden];
    const producto = { ...nuevaOrden[personaIdx][index] };
    producto.cantidad = Math.max(1, producto.cantidad + delta);
    nuevaOrden[personaIdx][index] = producto;
    setOrden(nuevaOrden);
  };

  const eliminarProducto = (personaIdx, index) => {
    const nuevaOrden = [...orden];
    nuevaOrden[personaIdx].splice(index, 1);
    setOrden(nuevaOrden);
  };

  const subtotal = orden
    .flat()
    .reduce((sum, item) => sum + item.precio * (item.cantidad || 1), 0)
    .toFixed(2);

  const generarOrden = () => {
    const idGenerado = Math.floor(Math.random() * 10000);
    setOrdenId(idGenerado);
    setEnviados([...orden]);
    alert(`Orden enviada a cocina. ID generado: ${idGenerado}`);
  };

  const categoriasOrdenadas = ["Combos", "Pupusas", "Bebidas", "Porciones"];

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Orden en mesa {mesaId}</h1>
          <p className="text-sm text-gray-400">
            Tipo de orden: <strong>{tipoOrden}</strong>
          </p>
          <p className="text-sm text-gray-400">Personas: {cantidad}</p>
        </div>
        <button
          onClick={() => navigate("/home")}
          className="bg-yellow-500 text-black px-4 py-2 rounded hover:bg-yellow-600"
        >
          <ArrowLeft className="inline mr-1" size={18} /> Regresar
        </button>
      </div>

      <div className="flex gap-2 mb-4">
        {Array.from({ length: cantidad }, (_, i) => (
          <button
            key={i}
            onClick={() => setPersonaActual(i)}
            className={`px-4 py-2 rounded font-medium text-sm ${
              personaActual === i ? "bg-blue-600 text-white" : "bg-white text-black"
            }`}
          >
            Persona {i + 1}
          </button>
        ))}
      </div>

      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <Search size={20} className="text-white" />
          <input
            type="text"
            placeholder="Buscar producto..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full p-2 rounded bg-slate-700 text-white placeholder-gray-400"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        {categoriasOrdenadas.map((categoria) => (
          <div key={categoria} className="bg-slate-800 p-3 rounded shadow-md max-h-[300px] overflow-y-auto">
            <h2 className="text-md font-semibold text-yellow-400 border-b border-yellow-400 mb-2">
              {categoria}
            </h2>
            {productosPorCategoria[categoria]
              .filter((p) => p.nombre.toLowerCase().includes(search.toLowerCase()))
              .map((p) => (
                <div key={p.id} className="flex justify-between items-center text-white mb-2">
                  <div>
                    <p className="font-medium text-sm">{p.nombre}</p>
                    <p className="text-sm text-gray-400">${p.precio.toFixed(2)}</p>
                  </div>
                  {categoria === "Pupusas" ? (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() =>
                          setCantidadesTemp((prev) => ({
                            ...prev,
                            [p.id]: Math.max(1, (prev[p.id] || 1) - 1),
                          }))
                        }
                        className="bg-slate-600 px-2 py-1 rounded text-white text-xs"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="text-sm w-4 text-center">
                        {cantidadesTemp[p.id] || 1}
                      </span>
                      <button
                        onClick={() =>
                          setCantidadesTemp((prev) => ({
                            ...prev,
                            [p.id]: (prev[p.id] || 1) + 1,
                          }))
                        }
                        className="bg-slate-600 px-2 py-1 rounded text-white text-xs"
                      >
                        <Plus size={12} />
                      </button>
                      <button
                        onClick={() => agregarProducto(p, cantidadesTemp[p.id] || 1)}
                        className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1 rounded"
                      >
                        Agregar
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => agregarProducto(p)}
                      className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1 rounded"
                    >
                      Agregar
                    </button>
                  )}
                </div>
              ))}
          </div>
        ))}
      </div>

      <div className="bg-slate-800 text-white p-4 rounded">
        <h2 className="text-lg font-semibold mb-2">Resumen de la orden</h2>
        {orden.every((lista) => lista.length === 0) ? (
          <p className="text-gray-400">No hay productos en la orden aún.</p>
        ) : (
          orden.map((lista, idx) => (
            <div key={idx} className="mb-4">
              <h3 className="font-semibold mb-1">Persona {idx + 1}</h3>
              <ul className="text-sm">
                {lista.map((item, i) => (
                  <li key={i} className="flex justify-between items-center border-b border-slate-600 py-1">
                    <span>
                      {item.nombre} x{item.cantidad} - $
                      {(item.precio * item.cantidad).toFixed(2)}
                    </span>
                    {!ordenId && (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => cambiarCantidad(idx, i, -1)}
                          className="bg-slate-600 px-2 py-1 rounded text-white text-xs"
                        >
                          <Minus size={12} />
                        </button>
                        <button
                          onClick={() => cambiarCantidad(idx, i, 1)}
                          className="bg-slate-600 px-2 py-1 rounded text-white text-xs"
                        >
                          <Plus size={12} />
                        </button>
                        <button
                          onClick={() => eliminarProducto(idx, i)}
                          className="bg-red-600 px-2 py-1 rounded text-white text-xs"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))
        )}
        <p className="text-right font-bold mt-2 text-green-400">Subtotal total: ${subtotal}</p>
      </div>

      {!ordenId && (
        <button
          onClick={generarOrden}
          className="mt-6 w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded flex justify-center items-center gap-2"
        >
          <Printer size={18} /> Enviar a cocina
        </button>
      )}
    </div>
  );
};

export default OrderBuilder;
