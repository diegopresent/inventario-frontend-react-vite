import Sidebar from '../components/Sidebar';
import { Outlet } from 'react-router-dom';

const MainLayout = () => {
    return (
        <div className="flex bg-gray-100 min-h-screen">
            {/* 1. Sidebar Fijo */}
            <Sidebar />

            {/* 2. Área de Contenido (se mueve a la derecha para no quedar debajo del sidebar) */}
            <div className="flex-1 ml-64 p-8">
                <Outlet /> {/* Aquí se renderizarán Dashboard, Productos, etc. */}
            </div>
        </div>
    );
};

export default MainLayout;