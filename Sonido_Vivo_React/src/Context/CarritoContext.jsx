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

    // Agregar producto (soporta cantidad opcional)
    function agregarAlCarrito(producto, cantidad = 1) {
        const cantidadNumerica = Math.max(1, Number(cantidad) || 1);
        const limiteStock = producto.stock == null ? 999 : Math.max(0, Number(producto.stock) || 0);

        // Un stock de cero no significa que falte el dato: el producto está agotado.
        if (limiteStock === 0) return;

        setCarrito(prev => {
            const index = prev.findIndex(item => item.codigo === producto.codigo);

            if (index !== -1) {
                const copia = [...prev];
                const cantidadActual = Number(copia[index].cantidad) || 1;
                const nuevoTotal = cantidadActual + cantidadNumerica;
                
                // Si el producto define stock, no permitir sobrepasarlo
                copia[index] = {
                    ...copia[index],
                    cantidad: Math.min(nuevoTotal, limiteStock)
                };
                return copia;
            }

            // Limitar al stock disponible del producto
            const cantidadInicial = Math.min(cantidadNumerica, limiteStock);
            return [...prev, { ...producto, cantidad: cantidadInicial }];
        });
    }

    // Cambiar cantidad directamente (+1 / -1 o nuevo valor)
    function cambiarCantidad(codigo, nuevaCantidad) {
        const valor = Number(nuevaCantidad);
        if (valor <= 0) {
            quitarDelCarrito(codigo);
            return;
        }

        setCarrito(prev => prev.map(item => {
            if (item.codigo === codigo) {
                const limiteStock = item.stock == null ? 999 : Math.max(0, Number(item.stock) || 0);
                return { ...item, cantidad: Math.min(valor, limiteStock) };
            }
            return item;
        }).filter(item => Number(item.cantidad ?? 1) > 0));
    }

    // Quitar por código SKU
    function quitarDelCarrito(codigo) {
        setCarrito(prev => prev.filter(item => item.codigo !== codigo));
    }

    // Vaciar todo (por ejemplo, después de pagar)
    function vaciarCarrito() {
        setCarrito([]);
    }

    // Totales calculados centralizadamente
    const cantidadTotal = carrito.reduce((acc, item) => acc + Number(item.cantidad ?? 1), 0);
    const totalPagar = carrito.reduce((acc, item) => acc + (Number(item.precio || 0) * Number(item.cantidad ?? 1)), 0);

    return (
        <CarritoContext.Provider value={{
            carrito,
            agregarAlCarrito,
            cambiarCantidad,
            quitarDelCarrito,
            vaciarCarrito,
            cantidadTotal,
            totalPagar
        }}>
            {children}
        </CarritoContext.Provider>
    );
}

// Hook personalizado para usarlo fácilmente: const { carrito } = useCarrito();
export function useCarrito() {
    return useContext(CarritoContext);
}
