import React, { useState } from "react";
import { Pencil, Power, UserPlus, ShieldPlus } from "lucide-react";
import useRolActual from "../../../hooks/useRolActual";

const restaurantesDisponibles = ["Restaurante 01", "Restaurante 02"];

export default function Usuarios() {
  const rolActual = useRolActual();
  const [usuarios, setUsuarios] = useState([
    {
      id: 1,
      nombre: "Ana",
      apellido: "López",
      pin: "1234",
      telefono: "50370123456",
      correo: "ana@restaurante.com",
      rol: "Mesera",
      restaurante: "Restaurante 01",
      activo: false,
    },
    {
      id: 2,
      nombre: "Juan Carlos Flores",
      apellido: "Palacios",
      pin: "7797",
      telefono: "3239078516",
      correo: "juanito003013_@hotmail.com",
      rol: "Gerente",
      restaurante: "Restaurante 01",
      activo: true,
    },
  ]);

  const [roles, setRoles] = useState(["Mesera", "Cocinero", "Gerente"]);
  const [formulario, setFormulario] = useState({
    id: null,
    nombre: "",
    apellido: "",
    pin: "",
    telefono: "",
    correo: "",
    rol: "",
    restaurante: "",
  });
  const [modoEdicion, setModoEdicion] = useState(false);
  const [nuevoRol, setNuevoRol] = useState("");
  const [busqueda, setBusqueda] = useState("");

  const handleChange = (e) => {
    setFormulario({ ...formulario, [e.target.name]: e.target.value });
  };

  const guardarUsuario = () => {
    if (!formulario.nombre || !formulario.apellido || !formulario.pin || !formulario.rol || !formulario.restaurante) return;

    if (modoEdicion) {
      setUsuarios(
        usuarios.map((u) =>
          u.id === formulario.id ? { ...formulario, activo: true } : u
        )
      );
      setModoEdicion(false);
    } else {
      const nuevo = {
        ...formulario,
        id: Date.now(),
        activo: true,
      };
      setUsuarios([...usuarios, nuevo]);
    }
    setFormulario({
      id: null,
      nombre: "",
      apellido: "",
      pin: "",
      telefono: "",
      correo: "",
      rol: "",
      restaurante: "",
    });
  };

  const desactivarUsuario = (id) => {
    setUsuarios(
      usuarios.map((u) => (u.id === id ? { ...u, activo: false } : u))
    );
  };

  const editarUsuario = (usuario) => {
    setFormulario(usuario);
    setModoEdicion(true);
  };

  const agregarRol = () => {
    if (nuevoRol && !roles.includes(nuevoRol)) {
      setRoles([...roles, nuevoRol]);
      setNuevoRol("");
    }
  };

  const usuariosFiltrados = usuarios.filter(
    (u) =>
      u.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      u.apellido.toLowerCase().includes(busqueda.toLowerCase()) ||
      u.correo.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-white">Usuarios del Restaurante</h2>
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Formulario de usuario */}
        <div className="w-full lg:w-1/2 border border-yellow-500 rounded-lg p-4">
          <h3 className="text-lg font-bold mb-3 text-yellow-400 flex items-center gap-2">
            <UserPlus size={20} /> {modoEdicion ? "Editar usuario" : "Agregar usuario"}
          </h3>
          <div className="grid grid-cols-1 gap-2">
            <input name="nombre" value={formulario.nombre} onChange={handleChange} placeholder="Nombre" className="w-full p-2 rounded bg-green-50 text-black" />
            <input name="apellido" value={formulario.apellido} onChange={handleChange} placeholder="Apellidos" className="w-full p-2 rounded bg-green-50 text-black" />
            <input name="pin" value={formulario.pin} onChange={handleChange} placeholder="PIN de ingreso" className="w-full p-2 rounded bg-green-50 text-black" />
            <input name="telefono" value={formulario.telefono} onChange={handleChange} placeholder="Teléfono" className="w-full p-2 rounded bg-green-50 text-black" />
            <input name="correo" value={formulario.correo} onChange={handleChange} placeholder="Correo electrónico" className="w-full p-2 rounded bg-green-50 text-black" />
            <select name="rol" value={formulario.rol} onChange={handleChange} className="w-full p-2 rounded bg-green-50 text-black">
              <option value="">Seleccione rol</option>
              {roles.map((r) => <option key={r}>{r}</option>)}
            </select>
            <select name="restaurante" value={formulario.restaurante} onChange={handleChange} className="w-full p-2 rounded bg-green-50 text-black">
              <option value="">Seleccione restaurante</option>
              {restaurantesDisponibles.map((r) => <option key={r}>{r}</option>)}
            </select>
          </div>
          <button onClick={guardarUsuario} className="mt-3 bg-yellow-500 text-black px-4 py-2 rounded hover:bg-yellow-600">{modoEdicion ? "Guardar cambios" : "Guardar usuario"}</button>

          {/* Crear nuevo rol */}
          <div className="mt-6 border-t border-yellow-500 pt-4">
            <h4 className="text-md font-semibold text-yellow-400 mb-2 flex items-center gap-2">
              <ShieldPlus size={18} /> Crear nuevo rol
            </h4>
            <div className="flex gap-2">
              <input value={nuevoRol} onChange={(e) => setNuevoRol(e.target.value)} placeholder="Ej. Cajero" className="flex-1 p-2 rounded bg-green-50 text-black" />
              <button onClick={agregarRol} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Agregar</button>
            </div>
            <ul className="list-disc list-inside mt-2 text-white">
              {roles.map((r) => <li key={r}>{r}</li>)}
            </ul>
          </div>
        </div>

        {/* Lista de usuarios */}
        <div className="w-full lg:w-1/2 border border-yellow-500 rounded-lg p-4 max-h-[600px] overflow-y-auto">
          <h3 className="text-lg font-bold text-yellow-400 mb-3 flex justify-between items-center">
            Usuarios registrados <span className="text-sm font-normal text-gray-300">({usuarios.length})</span>
          </h3>
          <input type="text" placeholder="Buscar usuario..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)} className="mb-3 w-full p-2 rounded bg-green-50 text-black" />
          {usuariosFiltrados.map((u) => (
            <div key={u.id} className="bg-white text-black rounded p-4 mb-4 shadow relative transition-transform hover:scale-[1.01]">
              <p className="font-semibold text-lg">{u.nombre} {u.apellido}</p>
              <span className="inline-block text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded font-semibold mb-1">{u.rol}</span>
              <p className="text-sm">Restaurante: {u.restaurante}</p>
              <p className="text-sm">Teléfono: {u.telefono}</p>
              <p className="text-sm">Correo: {u.correo}</p>
              <p className={`font-bold text-sm ${u.activo ? "text-green-600" : "text-red-600"}`}>
                {u.activo ? "Activo" : "Inactivo"}
              </p>
              <div className="absolute bottom-2 right-2 flex gap-3">
                <button onClick={() => editarUsuario(u)} title="Editar usuario">
                  <Pencil size={18} className="text-blue-600 hover:text-blue-800" />
                </button>
                <button onClick={() => desactivarUsuario(u.id)} title="Desactivar usuario">
                  <Power size={18} className="text-red-600 hover:text-red-800" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
