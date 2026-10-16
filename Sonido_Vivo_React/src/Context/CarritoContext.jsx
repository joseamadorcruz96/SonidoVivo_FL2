import { createContext, useContext, useState, useEffect } from "react";

const CarritoContext = createContext();

export function CarritoProvider({ children }) {
    // 1. Estado inicial: lee los productos guardados en LocalStorage (RF-19)
    const [carrito, setCarrito] = useState(() => {
        const guardado = localStorage.getItem('sv_carrito');
        return guardado ? JSON.parse(guardado) : [];
    });

    // 2. Efecto: cada vez que el carrito cambie, se sincroniza en LocalStorage
    useEffect(() => {
        localStorage.setItem('sv_carrito', JSON.stringify(carrito));
    }, [carrito]);

    // Agregar producto
    function agregarAlCarrito(producto) {
        setCarrito(prev => [...prev, producto]);
    }

    // Quitar por código SKU
    function quitarDelCarrito(codigo) {
        setCarrito(prev => prev.filter(item => item.codigo !== codigo));
    }

    // Vaciar todo (por ejemplo, después de pagar)
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

// Hook personalizado para usarlo fácilmente: const { carrito } = useCarrito();
export function useCarrito() {
    return useContext(CarritoContext);
}
