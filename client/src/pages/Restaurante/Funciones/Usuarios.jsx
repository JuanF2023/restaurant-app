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
  const handleCancelar = () => {
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
    setModoEdicion(false);
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

  const toggleActivoUsuario = (id) => {
    setUsuarios(
      usuarios.map((u) =>
        u.id === id ? { ...u, activo: !u.activo } : u
      )
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
  
  const camposRequeridosCompletos =
  formulario.nombre &&
  formulario.apellido &&
  formulario.pin &&
  formulario.rol &&
  formulario.restaurante;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-white">Usuarios del Restaurante</h2>
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Formulario de usuario */}
        <div className="w-full lg:w-1/2 bg-gradient-to-r from-slate-800 to-slate-700 border border-yellow-400 rounded-xl p-6 shadow text-white">
          <h3 className="text-lg font-bold mb-3 text-yellow-300 flex items-center gap-2">
            <UserPlus size={20} /> {modoEdicion ? "Editar usuario" : "Agregar usuario"}
          </h3>
          <div className="grid grid-cols-1 gap-3">
            <input name="nombre" value={formulario.nombre} onChange={handleChange} placeholder="Nombre"
              className="w-full rounded-md bg-slate-900 border border-slate-600 text-white px-3 py-2 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
            <input name="apellido" value={formulario.apellido} onChange={handleChange} placeholder="Apellidos"
              className="w-full rounded-md bg-slate-900 border border-slate-600 text-white px-3 py-2 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
            <input name="pin" value={formulario.pin} onChange={handleChange} placeholder="PIN de ingreso"
              className="w-full rounded-md bg-slate-900 border border-slate-600 text-white px-3 py-2 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
            <input name="telefono" value={formulario.telefono} onChange={handleChange} placeholder="Teléfono"
              className="w-full rounded-md bg-slate-900 border border-slate-600 text-white px-3 py-2 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
            <input name="correo" value={formulario.correo} onChange={handleChange} placeholder="Correo electrónico"
              className="w-full rounded-md bg-slate-900 border border-slate-600 text-white px-3 py-2 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
            <select name="rol" value={formulario.rol} onChange={handleChange}
              className="w-full rounded-md bg-slate-900 border border-slate-600 text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            >
              <option value="">Seleccione rol</option>
              {roles.map((r) => <option key={r}>{r}</option>)}
            </select>
            <select name="restaurante" value={formulario.restaurante} onChange={handleChange}
              className="w-full rounded-md bg-slate-900 border border-slate-600 text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            >
              <option value="">Seleccione restaurante</option>
              {restaurantesDisponibles.map((r) => <option key={r}>{r}</option>)}
            </select>
          </div>
          <div className="mt-4 flex items-center justify-end gap-3">
  <button
    onClick={handleCancelar}
    type="button"
    className="px-4 py-2 rounded border border-slate-600 text-slate-200
               bg-slate-800 hover:bg-slate-700 hover:border-slate-500
               focus:outline-none focus:ring-2 focus:ring-yellow-400/50 transition-all"
  >
    Cancelar
  </button>

  <button
    onClick={guardarUsuario}
    type="button"
    disabled={!camposRequeridosCompletos}
    className={`font-semibold px-4 py-2 rounded transition-all
      ${camposRequeridosCompletos
        ? "bg-yellow-400 hover:bg-yellow-500 text-black"
        : "bg-yellow-400/50 text-black/70 cursor-not-allowed"}`}
  >
    {modoEdicion ? "Guardar cambios" : "Guardar usuario"}
  </button>
</div>


          {/* Crear nuevo rol */}
          <div className="mt-6 border-t border-yellow-400 pt-4">
            <h4 className="text-md font-semibold text-yellow-300 mb-2 flex items-center gap-2">
              <ShieldPlus size={18} /> Crear nuevo rol
            </h4>
            <div className="flex gap-2">
              <input value={nuevoRol} onChange={(e) => setNuevoRol(e.target.value)} placeholder="Ej. Cajero"
                className="flex-1 rounded-md bg-slate-900 border border-slate-600 text-white px-3 py-2 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
              <button onClick={agregarRol} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">
                Agregar
              </button>
            </div>
            <ul className="list-disc list-inside mt-2 text-white">
              {roles.map((r) => <li key={r}>{r}</li>)}
            </ul>
          </div>
        </div>

       {/* Lista de usuarios */}
<div className="w-full lg:w-1/2 rounded-xl p-4 max-h-[600px] overflow-y-auto
                bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-950
                border border-yellow-500 shadow-inner">
  <h3 className="text-lg font-bold text-yellow-300 mb-3 flex justify-between items-center">
    Usuarios registrados <span className="text-sm font-normal text-slate-300">({usuarios.length})</span>
  </h3>

  {/* Búsqueda (oscura) */}
  <input
    type="text"
    placeholder="Buscar usuario..."
    value={busqueda}
    onChange={(e) => setBusqueda(e.target.value)}
    className="mb-3 w-full px-3 py-2 rounded-md
               bg-slate-900/70 border border-slate-700 text-slate-100 placeholder-slate-400
               focus:outline-none focus:ring-2 focus:ring-yellow-400/60 focus:border-yellow-400/60"
  />

  {usuariosFiltrados.map((u) => (
    <div
      key={u.id}
      className={[
        "relative rounded-xl p-4 mb-4 border transition-all",
        "bg-gradient-to-br from-slate-800/95 via-slate-900/95 to-slate-950/95",
        u.activo
          ? "border-slate-700 hover:border-yellow-400/60 hover:shadow-[0_0_0_1px_rgba(250,204,21,0.35)]"
          : "border-slate-800 opacity-75 grayscale-[25%]"
      ].join(" ")}
    >
      {/* Estado (badge) */}
      <span className={[
        "absolute top-3 right-3 text-[11px] px-2 py-1 rounded-full font-semibold",
        u.activo
          ? "bg-emerald-400/15 text-emerald-300 border border-emerald-500/30"
          : "bg-rose-400/10 text-rose-300 border border-rose-500/30"
      ].join(" ")}>
        <span className={[
          "inline-block w-2 h-2 rounded-full mr-1 align-middle",
          u.activo ? "bg-emerald-400" : "bg-rose-400"
        ].join(" ")} />
        {u.activo ? "Activo" : "Inactivo"}
      </span>

      <p className="font-semibold text-slate-100 text-lg pr-28">
        {u.nombre} {u.apellido}
      </p>

      <span className="inline-block text-xs md:text-sm mt-1
                        bg-yellow-400/15 text-yellow-300 border border-yellow-500/30
                        px-2 py-0.5 rounded-md font-semibold">
        {u.rol}
      </span>

      <div className="mt-2 space-y-0.5 text-sm">
        <p className="text-slate-300"><span className="text-slate-400">Restaurante:</span> {u.restaurante}</p>
        <p className="text-slate-300"><span className="text-slate-400">Teléfono:</span> {u.telefono}</p>
        <p className="text-slate-300"><span className="text-slate-400">Correo:</span> {u.correo}</p>
      </div>

      {/* Acciones */}
      <div className="absolute bottom-3 right-3 flex gap-3">
        <button onClick={() => editarUsuario(u)} title="Editar usuario"
                className="p-2 rounded-lg bg-slate-800/70 border border-slate-700
                           hover:border-blue-400/50 hover:shadow-[0_0_0_1px_rgba(59,130,246,0.25)]
                           transition-all">
          <Pencil size={18} className="text-blue-300" />
        </button>
        <button
  onClick={() => toggleActivoUsuario(u.id)}
  title={u.activo ? "Desactivar usuario" : "Activar usuario"}
  className={`p-2 rounded-lg bg-slate-800/70 border border-slate-700 transition-all
              ${u.activo
                ? "hover:border-rose-400/50 hover:shadow-[0_0_0_1px_rgba(244,63,94,0.25)]"
                : "hover:border-emerald-400/50 hover:shadow-[0_0_0_1px_rgba(16,185,129,0.25)]"}`}
>
  <Power
    size={18}
    className={u.activo ? "text-rose-300" : "text-emerald-300"}
  />
</button>

      </div>
    </div>
  ))}
</div>

      </div>
    </div>
  );
}
