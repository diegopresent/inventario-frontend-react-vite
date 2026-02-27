import { useState } from 'react';
import { useCategories } from '../hooks/useCategories';
import CategoryModal from '../components/CategoryModal';

const CategoriesPage = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const isAdmin = user.rol === 'ADMIN';

    const { 
        categories, loading, pagination, search,
        saveCategory, deleteCategory, handleSearch, executeSearch, changePage 
    } = useCategories();
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);

    const handleOpenCreate = () => {
        setEditingCategory(null);
        setIsModalOpen(true);
    };

    const handleOpenEdit = (category) => {
        setEditingCategory(category);
        setIsModalOpen(true);
    };

    const onFormSubmit = async (formData, id) => {
        const success = await saveCategory(formData, id);
        if (success) setIsModalOpen(false);
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <h1 className="text-3xl font-bold text-gray-800 tracking-tight">📁 Gestión de Categorías</h1>
                
                {/* TODOS PUEDEN CREAR CATEGORIAS */}
                <button 
                    onClick={handleOpenCreate}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg transition-transform active:scale-95 flex items-center gap-2"
                >
                    <span>+</span> Nueva Categoría
                </button>
            </div>

            {/* Barra de Búsqueda */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-8 flex gap-3">
                <input 
                    type="text" 
                    placeholder="Buscar categoría por nombre..." 
                    className="flex-1 bg-gray-50 border-none rounded-xl px-5 py-3 outline-none focus:ring-2 focus:ring-green-100 transition-all"
                    value={search}
                    onChange={(e) => handleSearch(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && executeSearch()}
                />
                <button 
                    onClick={executeSearch}
                    className="bg-gray-800 hover:bg-black text-white px-8 rounded-xl font-bold transition-colors"
                >
                    Buscar
                </button>
            </div>

            {/* Tabla de Categorías */}
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50 text-gray-400 text-[10px] font-black uppercase tracking-widest border-b border-gray-100">
                            <tr>
                                <th className="p-5">Nombre de la Categoría</th>
                                <th className="p-5 text-center">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading && categories.length === 0 ? (
                                <tr><td colSpan="2" className="p-10 text-center text-green-500 font-bold animate-pulse">Cargando categorías...</td></tr>
                            ) : categories.length === 0 ? (
                                <tr><td colSpan="2" className="p-10 text-center text-gray-400">No hay categorías registradas.</td></tr>
                            ) : (
                                categories.map(cat => (
                                    <tr key={cat.id} className="hover:bg-green-50/30 transition-colors group">
                                        <td className="p-4 font-bold text-gray-700">{cat.nombre}</td>
                                        <td className="p-4 text-center">
                                            <div className="flex justify-center gap-2">
                                                {/* AMBOS EDITAN */}
                                                <button onClick={() => handleOpenEdit(cat)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Editar">
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                                                </button>
                                                
                                                {/* SOLO ADMIN ELIMINA */}
                                                {isAdmin && (
                                                    <button onClick={() => deleteCategory(cat.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Eliminar">
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Controles de Paginación */}
                <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t border-gray-100">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        Página {pagination.page} de {pagination.totalPages}
                    </span>
                    <div className="flex gap-2">
                        <button 
                            onClick={() => changePage(pagination.page - 1)} 
                            disabled={pagination.page === 1}
                            className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-xs font-bold text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            Anterior
                        </button>
                        <button 
                            onClick={() => changePage(pagination.page + 1)} 
                            disabled={pagination.page >= pagination.totalPages}
                            className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-xs font-bold text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            Siguiente
                        </button>
                    </div>
                </div>
            </div>

            <CategoryModal 
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setEditingCategory(null);
                }}
                onSave={onFormSubmit}
                categoryToEdit={editingCategory}
                loading={loading}
            />
        </div>
    );
};

export default CategoriesPage;