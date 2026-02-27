import React from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import { useCategories } from '../hooks/useCategories';

const DashboardPage = () => {
    const { products, pagination: prodPagination } = useProducts();
    const { categories, pagination: catPagination } = useCategories();
    
    let user = { nombre: 'Invitado', rol: 'CLIENTE' };

    try {
        const storedUser = localStorage.getItem('user');
        if (storedUser && storedUser !== "undefined") {
            user = JSON.parse(storedUser);
        }
    } catch (error) {
        console.error("Error leyendo datos del usuario:", error);
    }

    return (
        <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-8 tracking-tight">
                {user.rol === 'ADMIN' ? '🚀 Panel de Control' : '👋 ¡Bienvenido!'}
            </h1>

            {/* Banner de Bienvenida */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-8 rounded-3xl shadow-xl text-white mb-10 flex flex-col md:flex-row justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold mb-2">
                        Hola, {user.nombre}
                    </h2>
                    <p className="opacity-90">Tienes acceso como <span className="bg-white/20 px-3 py-0.5 rounded-full text-xs font-bold uppercase">{user.rol}</span></p>
                </div>
                <div className="hidden md:block text-5xl opacity-20">📊</div>
            </div>

            {/* VISTA DE ADMIN Y CLIENTE (Mismo layout de cards) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Link to="/products" className="group bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
                        </div>
                        <h3 className="font-bold text-gray-800 text-lg">Productos</h3>
                    </div>
                    <p className="text-gray-400 text-sm mb-4">
                        {user.rol === 'ADMIN' ? 'Gestiona el inventario, stock y precios de tus artículos.' : 'Explora nuestro catálogo de productos actualizado.'}
                    </p>
                    <div className="text-2xl font-black text-gray-800">
                        {prodPagination.total ?? products.length} <span className="text-xs text-gray-400 font-normal uppercase">Items</span>
                    </div>
                </Link>

                <Link to="/categories" className="group bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-green-50 text-green-600 rounded-2xl group-hover:bg-green-600 group-hover:text-white transition-colors">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path></svg>
                        </div>
                        <h3 className="font-bold text-gray-800 text-lg">Categorías</h3>
                    </div>
                    <p className="text-gray-400 text-sm mb-4">
                        {user.rol === 'ADMIN' ? 'Organiza tus productos por tipos para un mejor control.' : 'Filtrar por las categorías que más te interesen.'}
                    </p>
                    <div className="text-2xl font-black text-gray-800">
                        {catPagination.total ?? categories.length} <span className="text-xs text-gray-400 font-normal uppercase">Categorías</span>
                    </div>
                </Link>

                {/* Esta card ahora se muestra para todos con el label de próximamente */}
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 opacity-60">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                        </div>
                        <h3 className="font-bold text-gray-800 text-lg">Usuarios</h3>
                    </div>
                    <p className="text-gray-400 text-sm mb-4">Próximamente: Control de accesos y perfiles de empleados.</p>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;