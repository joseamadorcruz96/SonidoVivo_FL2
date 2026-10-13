import { createContext, useContext, useState } from "react";

const CarritoContext = createContext();

export function CarritoProvider({ children }) {
    const [carrito, setCarrito] = useState([]);

    // 1. Agregar
    function agregarAlCarrito(producto) {
        setCarrito([...carrito, producto]);
    }

    // 2. Quitar por código SKU
    function quitarDelCarrito(codigo) {
        const carritoActualizado = carrito.filter(item => item.codigo !== codigo);
        setCarrito(carritoActualizado);
    }

    // 3. Vaciar todo (por ejemplo, después de pagar)
    function vaciarCarrito() {
        setCarrito([]);
    }

    const cantidadTotal = carrito.length;

    return (
        <CarritoContext.Provider value={{
            carrito,
            agregarAlCarrito,
            quitarDelCarrito,
            vaciarCarrito,
            cantidadTotal
        }}>
            {children}
        </CarritoContext.Provider>
    );
}

// Hook personalizado para usarlo fácilmente con: const { carrito } = useCarrito();
export function useCarrito() {
    return useContext(CarritoContext);
}
