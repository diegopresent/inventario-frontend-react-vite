import { useState, useEffect, useCallback } from 'react';
import Swal from 'sweetalert2';
import api from '../api/axios';

export const useCategories = () => {
    // Estados principales
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    
    // Estados de control
    const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
    const [search, setSearch] = useState("");
    const [searchTerm, setSearchTerm] = useState(""); // Término confirmado al dar Enter/Click

    const fetchCategories = useCallback(async () => {
        setLoading(true);
        try {
            const res = await api.get('/categories', { 
                params: { page: pagination.page, limit: 5, search: searchTerm } 
            });

            // Procesar Categorías (ajustado según si viene paginado o no)
            const catData = res.data.data || (Array.isArray(res.data) ? res.data : []);
            setCategories(catData);

            setPagination(prev => ({
                ...prev,
                totalPages: res.data.pagination?.totalPages || 1
            }));

        } catch (error) {
            console.error("Error cargando categorías:", error);
            Swal.fire('Error', 'No se pudieron cargar las categorías', 'error');
        } finally {
            setLoading(false);
        }
    }, [pagination.page, searchTerm]);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    const saveCategory = async (categoryData, id = null) => {
        setLoading(true);
        try {
            if (id) {
                await api.put(`/categories/${id}`, categoryData);
                Swal.fire('Actualizado', 'Categoría modificada', 'success');
            } else {
                await api.post('/categories', categoryData);
                Swal.fire('Creado', 'Nueva categoría añadida', 'success');
            }
            fetchCategories();
            return true;
        } catch (error) {
            const msg = error.response?.data?.message || 'Error al procesar categoría';
            Swal.fire('Error', msg, 'error');
            return false;
        } finally {
            setLoading(false);
        }
    };

    const deleteCategory = async (id) => {
        const result = await Swal.fire({
            title: '¿Eliminar categoría?',
            text: "Esto podría afectar a los productos asociados",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, borrar',
            cancelButtonText: 'Cancelar'
        });

        if (result.isConfirmed) {
            try {
                await api.delete(`/categories/${id}`);
                Swal.fire('Eliminado', 'La categoría ha sido borrada.', 'success');
                fetchCategories();
            } catch {
                Swal.fire('Error', 'No se pudo eliminar la categoría (puede tener productos asociados)', 'error');
            }
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
        categories, 
        loading, 
        pagination,
        search,
        saveCategory, 
        deleteCategory, 
        handleSearch,
        executeSearch,
        changePage,
        refresh: fetchCategories 
    };
};