import { useState } from 'react';
import { useProducts } from '../hooks/useProducts';
import ProductModal from '../components/ProductModal';
import StockActionModal from '../components/StockActionModal';
import MovementHistoryModal from '../components/MovementHistoryModal';

const ProductsPage = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const isAdmin = user.rol === 'ADMIN';

    const { 
        products, categories, loading, pagination, search,
        handleSearch, executeSearch, changePage, saveProduct, deleteProduct,
        sellProduct, addStock, getMovements 
    } = useProducts();

    // Estados para Modales
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);

    // Estados para Stock y Auditoría
    const [stockModal, setStockModal] = useState({ open: false, mode: 'SELL', product: null });
    const [historyModal, setHistoryModal] = useState({ open: false, product: null });

    const handleOpenCreate = () => {
        setEditingProduct(null);
        setIsModalOpen(true);
    };

    const handleOpenEdit = (product) => {
        setEditingProduct(product);
        setIsModalOpen(true);
    };

    const handleOpenStock = (product, mode) => {
        setStockModal({ open: true, mode, product });
    };

    const handleOpenHistory = (product) => {
        setHistoryModal({ open: true, product });
    };

    const onFormSubmit = async (formData) => {
        const success = await saveProduct(formData, editingProduct?.id);
        if (success) setIsModalOpen(false);
    };

    const onStockSubmit = async (id, data) => {
        const success = stockModal.mode === 'SELL' 
            ? await sellProduct(id, data) 
            : await addStock(id, data);
        if (success) setStockModal({ ...stockModal, open: false });
    };

    return (
        <div className="p-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <h1 className="text-3xl font-bold text-gray-800 tracking-tight">📦 Gestión de Inventario</h1>
                <button 
                    onClick={handleOpenCreate}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg transition-transform active:scale-95 flex items-center gap-2"
                >
                    <span>+</span> Nuevo Producto
                </button>
            </div>

            {/* Barra de Búsqueda */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-8 flex gap-3">
                <input 
                    type="text" 
                    placeholder="Buscar producto por nombre..." 
                    className="flex-1 bg-gray-50 border-none rounded-xl px-5 py-3 outline-none focus:ring-2 focus:ring-blue-100 transition-all"
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

            {/* Tabla de Resultados */}
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50 text-gray-400 text-[10px] font-black uppercase tracking-widest border-b border-gray-100">
                            <tr>
                                <th className="p-5 w-24 text-center">Imagen</th>
                                <th className="p-5">Detalle del Producto</th>
                                <th className="p-5">SKU</th>
                                <th className="p-5">Precio</th>
                                <th className="p-5">Stock</th>
                                <th className="p-5 text-center">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading && products.length === 0 ? (
                                <tr><td colSpan="6" className="p-10 text-center text-blue-500 font-bold animate-pulse">Cargando inventario...</td></tr>
                            ) : products.length === 0 ? (
                                <tr><td colSpan="6" className="p-10 text-center text-gray-400">No se encontraron productos registrados.</td></tr>
                            ) : (
                                products.map(product => (
                                    <tr key={product.id} className="hover:bg-blue-50/30 transition-colors group">
                                        <td className="p-4 text-center">
                                            <div className="w-12 h-12 rounded-lg overflow-hidden border border-gray-100 shadow-sm mx-auto bg-white">
                                                <img 
                                                    src={product.imagen || 'https://placehold.co/100?text=No+Img'} 
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                    alt={product.nombre}
                                                    onError={(e) => e.target.src = 'https://placehold.co/100?text=Error'}
                                                />
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="font-bold text-gray-700">{product.nombre}</div>
                                            <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-bold uppercase tracking-wide mt-1 inline-block">
                                                {product.categoria?.nombre || 'General'}
                                            </span>
                                        </td>
                                        <td className="p-4 text-xs font-mono text-gray-400">{product.sku || '---'}</td>
                                        <td className="p-4 font-bold text-gray-700 font-mono">${product.precio}</td>
                                        <td className="p-4">
                                            <span className={`px-3 py-1 rounded-lg text-[10px] font-black ${product.stock < 5 ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                                                {product.stock} UNID.
                                            </span>
                                        </td>
                                        <td className="p-4 text-center">
                                            <div className="flex justify-center gap-1">
                                                {/* NUEVAS ACCIONES DE STOCK */}
                                                <button onClick={() => handleOpenStock(product, 'SELL')} className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors" title="Registrar Venta">
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"></path></svg>
                                                </button>
                                                <button onClick={() => handleOpenStock(product, 'ADD')} className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors" title="Reabastecer Stock">
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
                                                </button>
                                                <button onClick={() => handleOpenHistory(product)} className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors" title="Ver Historial">
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>
                                                </button>
                                                
                                                <div className="w-px h-6 bg-gray-100 mx-1"></div>

                                                <button onClick={() => handleOpenEdit(product)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Editar">
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                                                </button>
                                                {isAdmin && (
                                                    <button onClick={() => deleteProduct(product.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Eliminar">
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

            {/* Componente Modal desacoplado */}
            <ProductModal 
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setEditingProduct(null);
                }}
                onSave={onFormSubmit}
                categories={categories}
                productToEdit={editingProduct}
                loading={loading}
            />

            {/* MODALES DE AUDITORÍA */}
            <StockActionModal 
                isOpen={stockModal.open}
                onClose={() => setStockModal({ ...stockModal, open: false })}
                onAction={onStockSubmit}
                product={stockModal.product}
                mode={stockModal.mode}
                loading={loading}
            />

            <MovementHistoryModal 
                isOpen={historyModal.open}
                onClose={() => setHistoryModal({ ...historyModal, open: false })}
                getMovements={getMovements}
                product={historyModal.product}
            />
        </div>
    );
};

export default ProductsPage;