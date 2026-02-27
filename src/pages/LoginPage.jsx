import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import api from '../api/axios';

const LoginPage = () => {
    const navigate = useNavigate();
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
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Contraseña</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="123456"
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg shadow-lg transition-all hover:scale-[1.02]"
                    >
                        Iniciar Sesión
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