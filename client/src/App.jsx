import { Navigate } from 'react-router-dom';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import Orders from "./pages/Orders";
import MenuManagement from "./pages/MenuManagement";
import Funciones from "./pages/Funciones";
import Reports from "./pages/Reports";
import HomePage from "./pages/HomePage";
import MainLayout from "./layouts/MainLayout";
import OrderBuilder from './pages/OrderBuilder';

// Subvistas dentro de /settings/
import Usuarios from './pages/Funciones/Usuarios';
import Turnos from './pages/Funciones/Turnos';
import Configuracion from './pages/Funciones/Configuracion';
import Impuestos from './pages/Funciones/Impuestos';
import Parametros from './pages/Funciones/Parametros';

function App() {
  return (
    <Router>
  <Routes>
    {/* Login separado */}
    <Route path="/login" element={<LoginPage />} />

    {/* Redirección desde "/" a /login */}
    <Route index element={<Navigate to="/login" />} />

    {/* Layout principal */}
    <Route path="/" element={<MainLayout />}>
      <Route path="home" element={<HomePage />} />
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="orders" element={<Orders />} />
      <Route path="menu" element={<MenuManagement />} />

      {/* Funciones */}
      <Route path="settings" element={<Funciones />} />
      <Route path="settings/usuarios" element={<Usuarios />} />
      <Route path="settings/turnos" element={<Turnos />} />
      <Route path="settings/configuracion" element={<Configuracion />} />
      <Route path="settings/impuestos" element={<Impuestos />} />
      <Route path="settings/parametros" element={<Parametros />} />

      <Route path="reports" element={<Reports />} />
      <Route path="orden/:mesaId" element={<OrderBuilder />} />
    </Route>
  </Routes>
</Router>

  );
}

export default App;
