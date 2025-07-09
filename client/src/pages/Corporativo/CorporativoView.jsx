// src/pages/Corporativo/CorporativoView.jsx
import React, { useState } from 'react';
import {
  Building2,
  Store,
  Plus,
  CheckCircle,
  LogOut,
  Save,
  BarChartBig,
  DoorOpen,
  Wrench,
  HomeIcon
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function CorporativoView() {
  const navigate = useNavigate();

  const [usuarioActual] = useState('Juan Carlos Flores');
  const [nombreNegocio, setNombreNegocio] = useState('');
  const [tipoNegocio, setTipoNegocio] = useState('');
  const [direccionNegocio, setDireccionNegocio] = useState('');
  const [telefonoContacto, setTelefonoContacto] = useState('');
  const [correoContacto, setCorreoContacto] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [encargado, setEncargado] = useState('');
  const [empleados, setEmpleados] = useState(0);
  const [nuevoTipo, setNuevoTipo] = useState('');
  const [tiposNegocio, setTiposNegocio] = useState(['Restaurante']);
  const [negocios, setNegocios] = useState([
    {
      id: 0,
      nombre: 'Apartamentos 04',
      tipo: 'Bienes raíces',
      direccion: 'Polígono 33B, Calle Nacional #28, Cantón El Capulín, Colón, La Libertad',
      empleados: 1,
      activo: true,
      encargado: 'Jose Jinoberto',
      telefono: '7681058',
      unidades: 4,
      pais: 'El Salvador',
      bandera: 'https://flagcdn.com/sv.svg'
    },
    {
      id: 1,
      nombre: 'Restaurante 01',
      tipo: 'Restaurante',
      direccion: 'Polígono 33B, Calle Nacional #28, Cantón El Capulín, Colón, La Libertad',
      empleados: 1,
      activo: false,
      encargado: 'Jose Jinoberto',
      telefono: '7681058',
      pais: 'El Salvador',
      bandera: 'https://flagcdn.com/sv.svg'
    },
    {
      id: 2,
      nombre: 'Locales Comerciales 01',
      tipo: 'Bienes raíces',
      direccion: 'Polígono 33B, Calle Nacional #28, Cantón El Capulín, Colón, La Libertad',
      empleados: 1,
      activo: false,
      encargado: 'Jose Jinoberto',
      telefono: '7681058',
      unidades: 2,
      pais: 'El Salvador',
      bandera: 'https://flagcdn.com/sv.svg'
    },
  ]);

  const handleAgregarTipo = () => {
    if (nuevoTipo.trim() && !tiposNegocio.includes(nuevoTipo)) {
      setTiposNegocio([...tiposNegocio, nuevoTipo]);
      setNuevoTipo('');
    }
  };

  const handleGuardarNegocio = () => {
    if (!nombreNegocio || !tipoNegocio || !direccionNegocio) {
      alert('Nombre, tipo y dirección son obligatorios');
      return;
    }
    const nuevoNegocio = {
      id: negocios.length + 1,
      nombre: nombreNegocio,
      tipo: tipoNegocio,
      direccion: direccionNegocio,
      telefono: telefonoContacto,
      correo: correoContacto,
      fechaInicio,
      descripcion,
      empleados: parseInt(empleados),
      activo: true,
      encargado,
      creadoPor: usuarioActual,
      fechaCreacion: new Date().toISOString(),
    };
    setNegocios([...negocios, nuevoNegocio]);
    setNombreNegocio('');
    setTipoNegocio('');
    setDireccionNegocio('');
    setTelefonoContacto('');
    setCorreoContacto('');
    setFechaInicio('');
    setDescripcion('');
    setEmpleados(0);
    setEncargado('');
  };

  const obtenerIcono = (tipo) => {
    if (tipo === 'Restaurante') return <Store size={18} className="text-orange-500" />;
    if (tipo === 'Bienes raíces') return <HomeIcon size={18} className="text-green-600" />;
    return <Building2 size={18} className="text-blue-500" />;
  };

  const handleNegocioClick = (negocio) => {
    if (negocio.nombre === 'Restaurante 01') {
      navigate('/home');
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto relative">
      <header className="mb-10 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div className="text-center md:text-left w-full">
          <h1 className="text-4xl font-bold text-gray-800">Inversiones JCF</h1>
          <p className="text-sm text-gray-600">
            Usuario actual: <span className="font-semibold text-black">{usuarioActual}</span>
          </p>
        </div>
        <div className="flex justify-center md:justify-end w-full md:w-auto">
          <button className="inline-flex items-center gap-2 text-sm text-red-600 hover:text-white hover:bg-red-600 px-3 py-1 rounded transition whitespace-nowrap cursor-pointer">
            <LogOut size={18} /> Cerrar sesión
          </button>
        </div>
      </header>

      {/* Sección tarjetas */}
      <section className="grid md:grid-cols-3 gap-6 mb-10">
        <div className="bg-blue-50 border border-blue-300 p-4 rounded-xl shadow transition-transform hover:scale-[1.02] cursor-pointer">
          <h3 className="text-lg font-bold text-blue-700 mb-2 flex items-center gap-2">
            <BarChartBig className="text-blue-700" /> Corporativo
          </h3>
          <p className="text-sm text-gray-700 mb-3">Acceso a reportes globales, usuarios y dashboards centralizados.</p>
          <button
  onClick={() => navigate('/corporativo')}
  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded font-bold flex justify-center items-center gap-2 transition cursor-pointer"
>
  <DoorOpen size={18} /> Entrar
</button>


        </div>

        {negocios.map((n) => (
          <div
            key={n.id}
            className="bg-white border border-gray-300 p-4 rounded-xl shadow transition-transform hover:scale-[1.02] cursor-pointer"
            onClick={() => handleNegocioClick(n)}
          >
            <h4 className="text-lg font-bold text-gray-800 mb-1 flex items-center gap-2">
              {obtenerIcono(n.tipo)} {n.nombre}
              {n.bandera && <img src={n.bandera} alt="flag" className="w-5 h-5 ml-2 rounded-sm" />}
            </h4>
            <p className="text-sm text-gray-600">Tipo: {n.tipo}</p>
            <p className="text-sm text-gray-600">Dirección: {n.direccion}</p>
            <p className="text-sm text-gray-600">Encargado: {n.encargado}</p>
            <p className="text-sm text-gray-600">Teléfono: {n.telefono}</p>
            <p className="text-sm text-gray-600">Empleados: {n.empleados}</p>
            {n.tipo === 'Bienes raíces' && n.unidades && (
              <p className="text-sm text-gray-600">Unidades: {n.unidades}</p>
            )}
            <p className="text-sm font-semibold mt-1 flex items-center gap-1">
              {n.activo ? (
                <span className="text-green-600 flex items-center gap-1"><CheckCircle size={16}/>Activo</span>
              ) : (
                <span className="text-yellow-600 flex items-center gap-1"><Wrench size={16}/>En construcción</span>
              )}
            </p>
            <button disabled={!n.activo} className={`mt-4 w-full ${n.activo ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-gray-300 text-gray-600 cursor-not-allowed'} py-2 rounded font-bold flex justify-center items-center gap-2 transition`}>
              <DoorOpen size={18} /> {n.activo ? 'Entrar' : 'En construcción'}
            </button>
          </div>
        ))}
      </section>
    </div>
  );
}
