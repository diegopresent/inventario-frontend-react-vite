import { useState, useEffect, useCallback } from 'react';
import Swal from 'sweetalert2';
import api from '../api/axios';

export const useProducts = () => {
    // Estados principales
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    
    // Estados de control
    const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
    const [search, setSearch] = useState("");
    const [searchTerm, setSearchTerm] = useState(""); // Término confirmado al dar Enter/Click

    // --- FUNCIÓN DE CARGA DE DATOS ---
    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            // Carga paralela para optimizar rendimiento
            const [prodRes, catRes] = await Promise.all([
                api.get('/products', { 
                    params: { page: pagination.page, limit: 5, search: searchTerm } 
                }),
                api.get('/categories')
            ]);

            // Procesar Productos
            if (prodRes.data.success || prodRes.data.data) {
                setProducts(prodRes.data.data || []);
                setPagination(prev => ({
                    ...prev,
                    totalPages: prodRes.data.pagination?.totalPages || 1,
                    total: prodRes.data.pagination?.total || 0
                }));
            }

            // Procesar Categorías
            const catData = Array.isArray(catRes.data) ? catRes.data : catRes.data.data || [];
            setCategories(catData);

        } catch (error) {
            console.error("Error en useProducts:", error);
            Swal.fire('Error', 'No se pudo sincronizar el inventario', 'error');
        } finally {
            setLoading(false);
        }
    }, [pagination.page, searchTerm]);

    // Efecto para recargar cuando cambian los filtros
    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // --- ACCIONES CRUD ---

    const saveProduct = async (formData, isEditingId = null) => {
        setLoading(true);
        try {
            // Axios detecta FormData y ajusta los headers automáticamente
            // Pero si quieres ser explícito: headers: { 'Content-Type': 'multipart/form-data' }
            
            if (isEditingId) {
                await api.put(`/products/${isEditingId}`, formData);
                Swal.fire('¡Actualizado!', 'Producto modificado correctamente', 'success');
            } else {
                await api.post('/products', formData);
                Swal.fire('¡Creado!', 'Nuevo producto en inventario', 'success');
            }
            
            fetchData(); // Recargar la tabla
            return true; // Retornamos true para indicar éxito
        } catch (error) {
            console.error(error);
            const msg = error.response?.data?.message || 'Error al procesar la solicitud';
            Swal.fire('Error', msg, 'error');
            return false; // Retornamos false para indicar fallo
        } finally {
            setLoading(false);
        }
    };

    const deleteProduct = async (id) => {
        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: "No podrás revertir esta acción",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        });

        if (result.isConfirmed) {
            try {
                await api.delete(`/products/${id}`);
                Swal.fire('Eliminado', 'El registro ha sido borrado.', 'success');
                fetchData();
            } catch {
                Swal.fire('Error', 'No se pudo eliminar el producto', 'error');
            }
        }
    };

    // --- NUEVAS FUNCIONES DE AUDITORÍA Y STOCK ---

    const sellProduct = async (id, data) => {
        setLoading(true);
        try {
            await api.post(`/products/${id}/sell`, data);
            Swal.fire('Venta Exitosa', 'El stock se ha actualizado correctamente', 'success');
            fetchData();
            return true;
        } catch (error) {
            const msg = error.response?.data?.message || 'Error al procesar la venta';
            Swal.fire('Error', msg, 'error');
            return false;
        } finally {
            setLoading(false);
        }
    };

    const addStock = async (id, data) => {
        setLoading(true);
        try {
            await api.post(`/products/${id}/add-stock`, data);
            Swal.fire('Stock Actualizado', 'Entrada de mercancía registrada', 'success');
            fetchData();
            return true;
        } catch (error) {
            const msg = error.response?.data?.message || 'Error al añadir stock';
            Swal.fire('Error', msg, 'error');
            return false;
        } finally {
            setLoading(false);
        }
    };

    const getMovements = async (id) => {
        try {
            const res = await api.get(`/products/${id}/movements`);
            return res.data.data || [];
        } catch (error) {
            console.error("Error cargando movimientos:", error);
            return [];
        }
    };

    // Funciones auxiliares para la UI
    const handleSearch = (term) => {
        setSearch(term); // Actualiza el input visual
    };

    const executeSearch = () => {
        setPagination(prev => ({ ...prev, page: 1 })); // Reset a página 1
        setSearchTerm(search); // Dispara el efecto
    };

    const changePage = (newPage) => {
        if (newPage >= 1 && newPage <= pagination.totalPages) {
            setPagination(prev => ({ ...prev, page: newPage }));
        }
    };

    return {
        // Datos
        products,
        categories,
        loading,
        pagination,
        search, // El valor del input
        
        // Acciones
        handleSearch,
        executeSearch,
        changePage,
        saveProduct,
        deleteProduct,
        sellProduct,
        addStock,
        getMovements
    };
};