import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import api from '../api/axios';

const RegisterPage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
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

        // Validaciones básicas
        if (formData.password !== formData.confirmPassword) {
            return Swal.fire('Error', 'Las contraseñas no coinciden', 'error');
        }

        setLoading(true);
        try {
            // Ajustamos los campos según lo que espere tu backend (nombre, email, password)
            await api.post('/auth/register', {
                nombre: formData.nombre,
                email: formData.email,
                password: formData.password
            });

            Swal.fire({
                icon: 'success',
                title: '¡Cuenta creada!',
                text: 'Ya puedes iniciar sesión',
                timer: 2000,
                showConfirmButton: false
            });

            setTimeout(() => navigate('/login'), 2000);
        } catch (error) {
            Swal.fire('Error', error.response?.data?.message || 'No se pudo crear la cuenta', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-md border border-gray-100 transform transition-all">
                
                <div className="text-center mb-8">
                    <div className="bg-blue-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-200">
                        <span className="text-white text-3xl font-black">+</span>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-800 tracking-tight">Crear Cuenta</h1>
                    <p className="text-gray-400 mt-2 text-sm">Únete a nuestro sistema de inventario</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 ml-1">Nombre Completo</label>
                        <input
                            type="text" name="nombre" required
                            value={formData.nombre} onChange={handleChange}
                            placeholder="Ej. Juan Pérez"
                            className="w-full px-5 py-3 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-blue-100 outline-none transition-all text-sm"
                        />
                    </div>

                    <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 ml-1">Correo Electrónico</label>
                        <input
                            type="email" name="email" required
                            value={formData.email} onChange={handleChange}
                            placeholder="usuario@ejemplo.com"
                            className="w-full px-5 py-3 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-blue-100 outline-none transition-all text-sm"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 ml-1">Contraseña</label>
                            <input
                                type="password" name="password" required
                                value={formData.password} onChange={handleChange}
                                placeholder="••••••"
                                className="w-full px-5 py-3 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-blue-100 outline-none transition-all text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 ml-1">Confirmar</label>
                            <input
                                type="password" name="confirmPassword" required
                                value={formData.confirmPassword} onChange={handleChange}
                                placeholder="••••••"
                                className="w-full px-5 py-3 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-blue-100 outline-none transition-all text-sm"
                            />
                        </div>
                    </div>

                    <button
                        type="submit" disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-100 transition-all active:scale-95 disabled:bg-gray-300"
                    >
                        {loading ? 'Procesando...' : 'Registrarse ahora'}
                    </button>
                </form>

                <div className="mt-8 text-center border-t border-gray-50 pt-6">
                    <p className="text-gray-400 text-sm">
                        ¿Ya tienes una cuenta? <Link to="/login" className="text-blue-600 font-bold hover:underline">Inicia Sesión</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;