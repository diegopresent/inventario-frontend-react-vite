import { useState, useEffect } from 'react';

const CategoryModal = ({ isOpen, onClose, onSave, categoryToEdit, loading }) => {
    const [form, setForm] = useState({
        nombre: ''
    });

    // Sincronizar el formulario con el objeto a editar cuando el modal se abre
    useEffect(() => {
        if (isOpen) {
            setForm({
                nombre: categoryToEdit ? categoryToEdit.nombre : ''
            });
        }
    }, [isOpen, categoryToEdit]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(form, categoryToEdit?.id); // Enviamos los datos y el ID si existe
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm p-4 animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden transform transition-all">
                {/* Header */}
                <div className="bg-green-600 p-5 text-white flex justify-between items-center shadow-md">
                    <h2 className="font-bold text-lg tracking-wide uppercase">
                        {categoryToEdit ? '✏️ Editar Categoría' : '✨ Nueva Categoría'}
                    </h2>
                    <button onClick={onClose} className="text-2xl opacity-80 hover:opacity-100 transition-opacity">×</button>
                </div>

                {/* Formulario */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-2">Nombre de la Categoría</label>
                        <input 
                            type="text" required 
                            className="w-full border-b-2 border-gray-100 py-2 outline-none focus:border-green-500 transition-colors text-sm"
                            placeholder="Ej. Electrónica, Hogar..."
                            value={form.nombre}
                            onChange={e => setForm({ nombre: e.target.value })}
                        />
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
                            className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold text-xs uppercase py-3 rounded-xl shadow-lg active:scale-95 transition-all disabled:bg-gray-300"
                        >
                            {loading ? 'Guardando...' : 'Guardar Cambios'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CategoryModal;