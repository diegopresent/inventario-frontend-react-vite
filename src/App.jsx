import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './layouts/MainLayout';
import ProductsPage from './pages/ProductsPage';
import CategoriesPage from './pages/CategoriesPage';

function App() {
  return (
    <Routes>
      {/* 1. Rutas Públicas */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* 2. Rutas Privadas (Protegidas) */}
      <Route element={<ProtectedRoute />}>
        
        {/* 3. Layout Principal (Sidebar + Contenido) */}
        <Route element={<MainLayout />}>
          
          {/* Aquí van todas las páginas internas */}
          <Route path="/dashboard" element={<DashboardPage />} />

          <Route path="/products" element={<ProductsPage />} />
          <Route path="/categories" element={<CategoriesPage />} />
          
          {/* Ruta por defecto si entran a la raíz y están logueados */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          
          {/* Próximamente: */}
          {/* <Route path="/products" element={<ProductsPage />} /> */}

        </Route>
      </Route>

    </Routes>
  )
}

export default App;