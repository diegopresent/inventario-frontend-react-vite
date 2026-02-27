import { useState, useEffect } from 'react';

const MovementHistoryModal = ({ isOpen, onClose, getMovements, product }) => {
    const [movements, setMovements] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen && product) {
            const fetchMovements = async () => {
                setLoading(true);
                const data = await getMovements(product.id);
                setMovements(data);
                setLoading(false);
            };
            fetchMovements();
        }
    }, [isOpen, product, getMovements]);

    if (!isOpen || !product) return null;

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[60] backdrop-blur-sm p-4 animate-fade-in">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden transform transition-all max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="bg-gray-800 p-6 text-white flex justify-between items-center">
                    <div>
                        <h2 className="font-bold text-lg uppercase tracking-wider">📜 Historial de Stock</h2>
                        <p className="text-xs opacity-60 mt-1">{product.nombre} - Auditoría de Movimientos</p>
                    </div>
                    <button onClick={onClose} className="text-2xl opacity-80 hover:opacity-100 transition-opacity">×</button>
                </div>

                {/* Tabla */}
                <div className="flex-1 overflow-y-auto p-6">
                    {loading ? (
                        <div className="text-center py-10 text-blue-500 font-bold animate-pulse">Cargando historial...</div>
                    ) : movements.length === 0 ? (
                        <div className="text-center py-10 text-gray-400 italic">No hay movimientos registrados para este producto.</div>
                    ) : (
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-gray-50 text-[10px] font-black text-gray-400 uppercase tracking-widest sticky top-0">
                                <tr>
                                    <th className="p-4">Fecha</th>
                                    <th className="p-4 text-center">Tipo</th>
                                    <th className="p-4 text-right">Cantidad</th>
                                    <th className="p-4">Motivo / Usuario</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {movements.map((move, idx) => {
                                    const isEntry = move.tipo === 'entrada';
                                    return (
                                        <tr key={move.id || idx} className="hover:bg-gray-50 transition-colors">
                                            <td className="p-4">
                                                <div className="text-xs font-bold text-gray-700">
                                                    {new Date(move.createdAt).toLocaleDateString()}
                                                </div>
                                                <div className="text-[10px] text-gray-400">
                                                    {new Date(move.createdAt).toLocaleTimeString()}
                                                </div>
                                            </td>
                                            <td className="p-4 text-center">
                                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${isEntry ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                                                    {isEntry ? '↑ Entrada' : '↓ Salida'}
                                                </span>
                                            </td>
                                            <td className={`p-4 text-right font-mono font-bold ${isEntry ? 'text-green-600' : 'text-red-600'}`}>
                                                {isEntry ? '+' : '-'}{move.cantidad}
                                            </td>
                                            <td className="p-4">
                                                <p className="text-xs text-gray-700 font-medium">{move.motivo || 'Sin descripción'}</p>
                                                <p className="text-[10px] text-blue-400 font-bold mt-0.5">👤 {move.usuario?.nombre || 'Sincronizado'}</p>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-end">
                    <button 
                        onClick={onClose}
                        className="bg-gray-800 hover:bg-black text-white px-8 py-3 rounded-xl text-xs font-bold uppercase transition-all shadow-lg active:scale-95"
                    >
                        Cerrar Registro
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MovementHistoryModal;