import { useState, useEffect } from 'react';

const ProductModal = ({ isOpen, onClose, onSave, categories, productToEdit, loading }) => {
    
    // 1. Estado base del formulario
    const [form, setForm] = useState({
        nombre: '',
        precio: '',
        stock: '',
        sku: '',
        categoriaId: '',
        imagen: null
    });

    const [previewUrl, setPreviewUrl] = useState(null);

    // 2. EFECTO DE SINCRONIZACIÓN: Actualiza el formulario cuando el modal se abre o cambia el producto
    useEffect(() => {
        if (isOpen) {
            if (productToEdit) {
                setForm({
                    nombre: productToEdit.nombre || '',
                    precio: productToEdit.precio || '',
                    stock: productToEdit.stock || '',
                    sku: productToEdit.sku || '',
                    categoriaId: productToEdit.categoryId || productToEdit.categoria?.id || '',
                    imagen: null
                });
                setPreviewUrl(productToEdit.imagen);
            } else {
                setForm({
                    nombre: '',
                    precio: '',
                    stock: '',
                    sku: '',
                    categoriaId: '',
                    imagen: null
                });
                setPreviewUrl(null);
            }
        }
    }, [isOpen, productToEdit]);

    // 3. Manejador de cambio de imagen con preview y limpieza de memoria
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Si ya había una URL previa generada localmente (no la del servidor), la liberamos
            if (previewUrl && previewUrl.startsWith('blob:')) {
                URL.revokeObjectURL(previewUrl);
            }
            
            setForm({ ...form, imagen: file });
            setPreviewUrl(URL.createObjectURL(file)); 
        }
    };

    // Limpieza al desmontar o cerrar
    useEffect(() => {
        return () => {
            if (previewUrl && previewUrl.startsWith('blob:')) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl, isOpen]);

    // 4. Manejador de envío
    const handleSubmit = (e) => {
        e.preventDefault();
        
        const formData = new FormData();
        formData.append('nombre', form.nombre);
        formData.append('precio', form.precio);
        formData.append('stock', form.stock);
        formData.append('sku', form.sku);
        formData.append('categoryId', form.categoriaId);

        if (form.imagen) {
            formData.append('imagen', form.imagen);
        }

        onSave(formData);
    };

    // Si el modal no está abierto, no renderizamos nada
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm p-4 animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all">
                {/* Header */}
                <div className="bg-blue-600 p-5 text-white flex justify-between items-center shadow-md">
                    <h2 className="font-bold text-lg tracking-wide uppercase">
                        {productToEdit ? '✏️ Editar Producto' : '✨ Nuevo Producto'}
                    </h2>
                    <button onClick={onClose} className="text-2xl opacity-80 hover:opacity-100 transition-opacity">×</button>
                </div>

                {/* Formulario */}
                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    {/* Nombre */}
                    <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1">Nombre</label>
                        <input 
                            type="text" required 
                            className="w-full border-b-2 border-gray-100 py-2 outline-none focus:border-blue-500 transition-colors text-sm"
                            placeholder="Ej. Monitor 24 pulgadas"
                            value={form.nombre}
                            onChange={e => setForm({...form, nombre: e.target.value})}
                        />
                    </div>

                    {/* Categoría */}
                    <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1">Categoría</label>
                        <select 
                            required
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                            value={form.categoriaId}
                            onChange={e => setForm({...form, categoriaId: e.target.value})}
                        >
                            <option value="">Seleccione una opción...</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                            ))}
                        </select>
                    </div>

                    {/* Precio y Stock */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1">Precio ($)</label>
                            <input 
                                type="number" step="0.01" required 
                                className="w-full border-b-2 border-gray-100 py-2 outline-none focus:border-blue-500 transition-colors text-sm"
                                value={form.precio}
                                onChange={e => setForm({...form, precio: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1">Stock</label>
                            <input 
                                type="number" required 
                                className="w-full border-b-2 border-gray-100 py-2 outline-none focus:border-blue-500 transition-colors text-sm"
                                value={form.stock}
                                onChange={e => setForm({...form, stock: e.target.value})}
                            />
                        </div>
                    </div>

                    {/* SKU */}
                    <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1">SKU (Código)</label>
                        <input 
                            type="text" 
                            className="w-full border-b-2 border-gray-100 py-2 outline-none focus:border-blue-500 transition-colors text-sm"
                            placeholder="Opcional"
                            value={form.sku}
                            onChange={e => setForm({...form, sku: e.target.value})}
                        />
                    </div>

                    {/* Imagen */}
                    <div className="bg-blue-50/50 p-4 rounded-xl border-2 border-dashed border-blue-100 text-center">
                        <label className="block text-[10px] font-black text-blue-400 uppercase mb-3">Imagen del Producto</label>
                        
                        {/* Preview Dinámico */}
                        {previewUrl && (
                            <div className="flex justify-center mb-3">
                                <img src={previewUrl} alt="Preview" className="w-20 h-20 object-cover rounded-lg shadow-md border-2 border-white" />
                            </div>
                        )}

                        <input 
                            type="file" accept="image/*"
                            className="text-[10px] file:bg-blue-600 file:text-white file:border-none file:px-3 file:py-1 file:rounded-full file:font-bold cursor-pointer"
                            onChange={handleImageChange}
                        />
                        {form.imagen && (
                            <p className="mt-2 text-[10px] text-green-600 font-bold">✓ Nuevo archivo: {form.imagen.name}</p>
                        )}
                    </div>

                    {/* Botones */}
                    <div className="flex gap-3 pt-4 border-t border-gray-100">
                        <button 
                            type="button" 
                            onClick={onClose}
                            className="flex-1 text-gray-400 font-bold text-xs uppercase hover:text-gray-600 transition-colors py-3"
                        >
                            Cancelar
                        </button>
                        <button 
                            type="submit" 
                            disabled={loading}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase py-3 rounded-xl shadow-lg active:scale-95 transition-all disabled:bg-gray-300"
                        >
                            {loading ? 'Guardando...' : 'Guardar Producto'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProductModal;