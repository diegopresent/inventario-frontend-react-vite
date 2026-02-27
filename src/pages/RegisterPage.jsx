import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import api from '../api/axios';
import InteractiveBear from '../components/InteractiveBear';

const RegisterPage = () => {
    const navigate = useNavigate();
    
    // Estados
    const [loading, setLoading] = useState(false);
    const [isPasswordFocus, setIsPasswordFocus] = useState(false); // Controla al oso
    
    const [formData, setFormData] = useState({
        nombre: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validaciones básicas antes de enviar
        if (formData.password !== formData.confirmPassword) {
            return Swal.fire('Error', 'Las contraseñas no coinciden', 'error');
        }

        if (loading) return;
        setLoading(true);

        try {
            // 1. Petición de Registro al Backend
            await api.post('/auth/register', {
                nombre: formData.nombre,
                email: formData.email,
                password: formData.password
            });

            // 2. Alerta de Éxito
            Swal.fire({
                icon: 'success',
                title: '¡Cuenta creada!',
                text: 'Ya puedes iniciar sesión',
                timer: 2000,
                showConfirmButton: false
            });

            // 3. Redirigir al Login
            setTimeout(() => navigate('/login'), 2000);

        } catch (error) {
            console.error(error);
            Swal.fire('Error', error.response?.data?.message || 'No se pudo crear la cuenta', 'error');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
            {/* Contenedor principal (Card) */}
            <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-gray-100 overflow-visible relative mt-20">
                
                {/* --- COMPONENTE DEL OSO (Reutilizado) --- */}
                <div className="absolute left-0 right-0 -top-[70px] flex justify-center pointer-events-none">
                    <InteractiveBear 
                        // El oso rastrea la longitud del email (es lo estándar)
                        inputLength={formData.email.length} 
                        isPasswordFocus={isPasswordFocus}
                        // En registro no solemos poner "mostrar contraseña", así que false por defecto
                        showPassword={false} 
                    />
                </div>

                <div className="px-8 pb-8 pt-16 text-center">
                    <h1 className="text-3xl font-black text-gray-800 tracking-tighter mb-2">Crear Cuenta</h1>
                    <p className="text-gray-400 text-sm font-medium mb-8">Únete a nuestro sistema de inventario</p>

                    <form onSubmit={handleSubmit} className="space-y-4 text-left">
                        
                        {/* NOMBRE */}
                        <div className="group">
                            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 ml-1">Nombre Completo</label>
                            <input
                                type="text" name="nombre" required
                                value={formData.nombre} onChange={handleChange}
                                placeholder="Ej. Juan Pérez"
                                className="w-full px-5 py-3 bg-gray-50 rounded-xl border-2 border-gray-100 focus:border-blue-500 focus:bg-white outline-none transition-all font-medium text-gray-700"
                                disabled={loading}
                                onFocus={() => setIsPasswordFocus(false)} // Oso mira
                            />
                        </div>

                        {/* EMAIL */}
                        <div className="group">
                            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 ml-1">Correo Electrónico</label>
                            <input
                                type="email" name="email" required
                                value={formData.email} onChange={handleChange}
                                placeholder="usuario@ejemplo.com"
                                className="w-full px-5 py-3 bg-gray-50 rounded-xl border-2 border-gray-100 focus:border-blue-500 focus:bg-white outline-none transition-all font-medium text-gray-700"
                                disabled={loading}
                                onFocus={() => setIsPasswordFocus(false)} // Oso mira
                            />
                        </div>

                        {/* CONTRASEÑA - OSO SE TAPA */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 ml-1">Contraseña</label>
                                <input
                                    type="password" name="password" required
                                    value={formData.password} onChange={handleChange}
                                    placeholder="••••••"
                                    className="w-full px-5 py-3 bg-gray-50 rounded-xl border-2 border-gray-100 focus:border-blue-500 focus:bg-white outline-none transition-all font-medium text-gray-700"
                                    disabled={loading}
                                    onFocus={() => setIsPasswordFocus(true)} // ¡TAPAR OJOS!
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 ml-1">Confirmar</label>
                                <input
                                    type="password" name="confirmPassword" required
                                    value={formData.confirmPassword} onChange={handleChange}
                                    placeholder="••••••"
                                    className="w-full px-5 py-3 bg-gray-50 rounded-xl border-2 border-gray-100 focus:border-blue-500 focus:bg-white outline-none transition-all font-medium text-gray-700"
                                    disabled={loading}
                                    onFocus={() => setIsPasswordFocus(true)} // ¡TAPAR OJOS TAMBIÉN!
                                />
                            </div>
                        </div>

                        {/* BOTÓN SUBMIT */}
                        <button
                            type="submit" disabled={loading}
                            className={`w-full text-white font-bold py-4 rounded-xl shadow-xl transition-all mt-4 
                                ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 hover:scale-[1.01]'}`}
                        >
                            {loading ? 'Procesando...' : 'Registrarse ahora'}
                        </button>
                    </form>

                    <div className="mt-8 text-center border-t border-gray-100 pt-6">
                        <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">
                            ¿Ya tienes una cuenta? <Link to="/login" className="text-blue-600 hover:underline">Inicia Sesión</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;