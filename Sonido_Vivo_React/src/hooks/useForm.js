import { useState } from 'react';

/**
 * Hook personalizado para manejar el estado y cambios de cualquier formulario (DRY).
 * Maneja inputs de texto, email, password, select y checkbox.
 */
export function useForm(valoresIniciales = {}) {
    const [datos, setDatos] = useState(valoresIniciales);
    const [errores, setErrores] = useState({});

    // Manejador genérico para cualquier input
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        
        setDatos(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));

        // Limpia el mensaje de error mientras el usuario escribe para corregirlo
        if (errores[name]) {
            setErrores(prev => ({ ...prev, [name]: '' }));
        }
    };

    // Reiniciar el formulario a sus valores originales
    const resetForm = () => {
        setDatos(valoresIniciales);
        setErrores({});
    };

    return {
        datos,
        setDatos,
        errores,
        setErrores,
        handleChange,
        resetForm
    };
}
