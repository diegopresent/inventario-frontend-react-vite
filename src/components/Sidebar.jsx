import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const Sidebar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        Swal.fire({
            title: '¿Cerrar sesión?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, salir'
        }).then((result) => {
            if (result.isConfirmed) {
                // Borramos token y usuario
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                navigate('/login');
            }
        });
    };

    return (
        <div className="w-64 h-screen bg-gray-900 text-white fixed left-0 top-0 flex flex-col shadow-xl">
            {/* Logo */}
            <div className="p-6 text-center border-b border-gray-700">
                <h1 className="text-2xl font-bold tracking-wider">INVENTARIO</h1>
                <span className="text-xs text-blue-400">Panel Administrativo</span>
            </div>

            {/* Menú de Navegación */}
            <nav className="flex-1 p-4 space-y-2">
                <Link to="/dashboard" className="block px-4 py-3 rounded hover:bg-gray-800 transition">
                    📊 Dashboard
                </Link>
                <Link to="/products" className="block px-4 py-3 rounded hover:bg-gray-800 transition">
                    📦 Productos
                </Link>
                <Link to="/categories" className="block px-4 py-3 rounded hover:bg-gray-800 transition">
                    🏷️ Categorías
                </Link>
            </nav>

            {/* Botón Salir */}
            <div className="p-4 border-t border-gray-700">
                <button
                    onClick={handleLogout}
                    className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded transition flex items-center justify-center gap-2"
                >
                    🚪 Cerrar Sesión
                </button>
            </div>
        </div>
    );
};

export default Sidebar;