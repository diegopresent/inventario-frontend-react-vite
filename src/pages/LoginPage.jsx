import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import api from '../api/axios';

const LoginPage = () => {
    const navigate = useNavigate();
    
    const [loading, setLoading] = useState(false);
    
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

            // 3. Guardar en el navegador
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
            setLoading(false); // Desbloqueamos el botón solo si hubo error para que intente de nuevo
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md border border-gray-200">

                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">Sistema Inventario</h1>
                    <p className="text-gray-500 mt-2">Ingresa tus credenciales</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Correo</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="admin@prueba.com"
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                            required
                            disabled={loading} // Desactivar input mientras carga
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Contraseña</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="••••••"
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                            required
                            disabled={loading} // Desactivar input mientras carga
                        />
                    </div>

                    {/* 2. Botón Inteligente */}
                    <button
                        type="submit"
                        disabled={loading} // Atributo clave para evitar clicks
                        className={`w-full text-white font-bold py-3 rounded-lg shadow-lg transition-all 
                            ${loading 
                                ? 'bg-gray-400 cursor-not-allowed' // Estilo deshabilitado
                                : 'bg-blue-600 hover:bg-blue-700 hover:scale-[1.02]' // Estilo normal
                            }`}
                    >
                        {loading ? (
                            <div className="flex items-center justify-center gap-2">
                                {/* Pequeño spinner CSS */}
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                <span>Verificando...</span>
                            </div>
                        ) : (
                            'Iniciar Sesión'
                        )}
                    </button>
                </form>

                <div className="mt-6 text-center border-t border-gray-100 pt-6">
                    <p className="text-gray-500 text-sm">
                        ¿No tienes una cuenta? <Link to="/register" className="text-blue-600 font-bold hover:underline">Regístrate gratis</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;