import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
    // 1. Buscamos el token en la caja fuerte
    const token = localStorage.getItem('token');

    // 2. Si no hay token, ¡FUERA! Al Login
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    // 3. Si hay token, déjalo pasar a la ruta hija (Outlet)
    return <Outlet />;
};

export default ProtectedRoute;