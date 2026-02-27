import { useState, useEffect } from 'react';

const StockActionModal = ({ isOpen, onClose, onAction, product, mode, loading }) => {
    const [formData, setFormData] = useState({ cantidad: 1, motivo: '' });

    // Resetear formulario cada vez que se abre el modal
    useEffect(() => {
        if (isOpen) {
            setFormData({ cantidad: 1, motivo: '' });
        }
    }, [isOpen]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onAction(product.id, {
            cantidad: Number(formData.cantidad),
            motivo: formData.motivo
        });
    };

    if (!isOpen || !product) return null;

    const isSell = mode === 'SELL';

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[60] backdrop-blur-sm p-4 animate-fade-in">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden transform transition-all">
                {/* Header Dinámico */}
                <div className={`${isSell ? 'bg-orange-500' : 'bg-emerald-600'} p-6 text-white text-center`}>
                    <div className="text-4xl mb-2">{isSell ? '📉' : '📈'}</div>
                    <h2 className="font-bold text-xl uppercase tracking-wider">
                        {isSell ? 'Registrar Venta' : 'Reabastecer Stock'}
                    </h2>
                    <p className="text-xs opacity-80 mt-1">{product.nombre}</p>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    {/* Cantidad */}
                    <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Cantidad a {isSell ? 'vender' : 'ingresar'}</label>
                        <input 
                            type="number" min="1" required 
                            className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 text-lg font-bold outline-none focus:ring-2 focus:ring-blue-100 transition-all"
                            value={formData.cantidad}
                            onChange={e => setFormData({...formData, cantidad: e.target.value})}
                        />
                        {isSell && (
                            <p className="text-[10px] text-orange-600 font-bold mt-2">Stock disponible: {product.stock} unidades</p>
                        )}
                    </div>

                    {/* Motivo */}
                    <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Motivo / Descripción</label>
                        <textarea 
                            className="w-full bg-gray-50 border-none rounded-2xl px-5 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-100 transition-all h-24 resize-none"
                            placeholder={isSell ? "Ej. Venta rápida mostrador" : "Ej. Lote recibido de proveedor X"}
                            value={formData.motivo}
                            onChange={e => setFormData({...formData, motivo: e.target.value})}
                        />
                    </div>

                    {/* Botones */}
                    <div className="flex gap-4 pt-2">
                        <button 
                            type="button" 
                            onClick={onClose}
                            className="flex-1 text-gray-400 font-bold text-xs uppercase hover:text-gray-600 transition-colors"
                        >
                            Cancelar
                        </button>
                        <button 
                            type="submit" 
                            disabled={loading || (isSell && formData.cantidad > product.stock)}
                            className={`flex-1 ${isSell ? 'bg-orange-500 hover:bg-orange-600' : 'bg-emerald-600 hover:bg-emerald-700'} text-white font-bold text-xs uppercase py-4 rounded-2xl shadow-lg active:scale-95 transition-all disabled:bg-gray-300`}
                        >
                            {loading ? 'Procesando...' : 'Confirmar'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default StockActionModal;