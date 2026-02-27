import axios from 'axios';

// Creamos la conexión base
const api = axios.create({// Esto elegirá automáticamente la URL correcta según si estás en local o prod
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
    /*
    headers: {
        'Content-Type': 'application/json'
    }
    */
});

// Interceptor: Antes de cada petición, inyectamos el token si existe
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;