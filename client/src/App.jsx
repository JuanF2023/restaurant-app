import { Navigate } from 'react-router-dom';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Login
import LoginPage from './pages/LoginPage.jsx';

// Corporativo
import CorporativoLayout from './components/layouts/CorporativoLayout.jsx';
import CorporativoView from './pages/Corporativo/CorporativoView.jsx';
import CorporativoDashboard from './pages/Corporativo/CorporativoDashboard.jsx';

// Restaurante - Layout
import RestauranteLayout from './components/layouts/RestauranteLayout.jsx';

// Restaurante - Vistas principales
import HomePage from './pages/Restaurante/HomePage.jsx';
import MenuManagement from './pages/Restaurante/MenuManagement.jsx';
import OrderBuilder from './pages/Restaurante/OrderBuilder.jsx';
import Orders from './pages/Restaurante/Orders.jsx';
import Reports from './pages/Restaurante/Reports.jsx';
import Funciones from './pages/Restaurante/Funciones/Funciones.jsx';

// Restaurante - Subvistas de Funciones
import Usuarios from './pages/Restaurante/Funciones/Usuarios.jsx';
import Turnos from './pages/Restaurante/Funciones/Turnos.jsx';
import Configuracion from './pages/Restaurante/Funciones/Configuracion.jsx';
import Impuestos from './pages/Restaurante/Funciones/Impuestos.jsx';

function App() {
  return (
    <Router>
      <Routes>
        {/* Login */}
        <Route path="/login" element={<LoginPage />} />
        <Route index element={<Navigate to="/login" />} />

        {/* Vista de selección de negocio (sin layout) */}
        <Route path="/corporacion" element={<CorporativoView />} />

        {/* Corporativo (con layout) */}
        <Route element={<CorporativoLayout />}>
          <Route path="/corporativo" element={<CorporativoDashboard />} />
          {/* Aquí puedes añadir más rutas corporativas */}
        </Route>

        {/* Restaurante (con layout) */}
        <Route element={<RestauranteLayout />}>
          <Route path="/home" element={<HomePage />} />
          <Route path="/ordenes" element={<Orders />} />
          <Route path="/menu" element={<MenuManagement />} />
          <Route path="/funciones" element={<Funciones />} />
          <Route path="/reportes" element={<Reports />} />
          <Route path="/ordenar" element={<OrderBuilder />} />

          {/* Subvistas de Funciones */}
          <Route path="/funciones/usuarios" element={<Usuarios />} />
          <Route path="/funciones/turnos" element={<Turnos />} />
          <Route path="/funciones/configuracion" element={<Configuracion />} />
          <Route path="/funciones/impuestos" element={<Impuestos />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
