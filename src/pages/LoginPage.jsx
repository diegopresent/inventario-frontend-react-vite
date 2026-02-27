import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import api from '../api/axios';
import InteractiveBear from '../components/InteractiveBear';

const LoginPage = () => {
    const navigate = useNavigate();
    
    // Estados de interfaz y datos
    const [loading, setLoading] = useState(false);
    const [isPasswordFocus, setIsPasswordFocus] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Evitar doble envío si ya está cargando
        if (loading) return;

        setLoading(true); // Bloqueamos el botón

        try {
            // 1. Petición al Backend
            const response = await api.post('/auth/login', formData);

            // 2. Extraer datos
            const { token, user } = response.data;

            // 3. Guardar en el navegador (LocalStorage)
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));

            // 4. Alerta de Éxito
            Swal.fire({
                icon: 'success',
                title: '¡Bienvenido!',
                text: 'Iniciando sesión...',
                timer: 1500,
                showConfirmButton: false
            });

            // 5. Redirigir
            setTimeout(() => {
                navigate('/');
            }, 1500);

        } catch (error) {
            console.error(error);
            Swal.fire({
                icon: 'error',
                title: 'Error de acceso',
                text: error.response?.data?.message || 'Credenciales incorrectas',
            });
            setLoading(false); // Desbloqueamos el botón solo si hubo error
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
            <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-gray-100 overflow-visible relative mt-20">
                
                {/* --- COMPONENTE DEL OSO --- */}
                <div className="absolute left-0 right-0 -top-[70px] flex justify-center pointer-events-none">
                    <InteractiveBear 
                        inputLength={formData.email.length} 
                        isPasswordFocus={isPasswordFocus}
                        showPassword={showPassword}
                    />
                </div>

                <div className="px-8 pb-8 pt-16 text-center">
                    <h1 className="text-3xl font-black text-gray-800 tracking-tighter mb-2">¡Hola otra vez!</h1>
                    <p className="text-gray-400 text-sm font-medium mb-8">Ingresa tus credenciales</p>

                    <form onSubmit={handleSubmit} className="space-y-5 text-left">
                        
                        {/* INPUT EMAIL */}
                        <div className="group">
                            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Correo</label>
                            <input 
                                type="email" name="email"
                                value={formData.email} onChange={handleChange}
                                placeholder="admin@prueba.com"
                                className="w-full px-5 py-4 bg-gray-50 rounded-xl border-2 border-gray-100 focus:border-blue-500 focus:bg-white outline-none transition-all font-medium text-gray-700"
                                required
                                disabled={loading}
                                onFocus={() => setIsPasswordFocus(false)} // El oso mira
                            />
                        </div>

                        {/* INPUT PASSWORD */}
                        <div className="group relative">
                            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Contraseña</label>
                            <input 
                                type={showPassword ? "text" : "password"} name="password"
                                value={formData.password} onChange={handleChange}
                                placeholder="••••••"
                                className="w-full px-5 py-4 bg-gray-50 rounded-xl border-2 border-gray-100 focus:border-blue-500 focus:bg-white outline-none transition-all font-medium text-gray-700"
                                required
                                disabled={loading}
                                onFocus={() => setIsPasswordFocus(true)} // El oso se tapa
                            />
                            {/* Botón Ojo */}
                            <button 
                                type="button" onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-[42px] text-gray-400 hover:text-blue-600 transition-colors p-2"
                                disabled={loading}
                            >
                                {showPassword ? (
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                ) : (
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a10.059 10.059 0 013.999-5.42m3.71-1.287L2.458 12M12 5a10.04 10.04 0 014.992 1.34M17.478 9.988L21 12m-3.522 6.012L21.542 12M7.5 7.5l9 9" /></svg>
                                )}
                            </button>
                        </div>

                        {/* BOTÓN SUBMIT */}
                        <button 
                            type="submit" disabled={loading}
                            className={`w-full text-white font-bold py-4 rounded-xl shadow-xl transition-all ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-gray-900 hover:bg-black hover:scale-[1.01]'}`}
                        >
                            {loading ? 'Iniciando...' : 'Iniciar Sesión'}
                        </button>
                    </form>

                    <div className="mt-8 text-center border-t border-gray-100 pt-6">
                        <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">
                            ¿No tienes una cuenta? <Link to="/register" className="text-blue-600 hover:underline">Regístrate gratis</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;