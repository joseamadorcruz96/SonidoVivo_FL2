// Persistencia temporal de ordenes hasta integrar ms-ventas-boletas (Modulo 5)

export const getOrdenes = () => {
    const guardadas = localStorage.getItem('sv_ordenes');
    return guardadas ? JSON.parse(guardadas) : [];
};

export const guardarOrden = (nuevaOrden) => {
    const ordenes = getOrdenes();
    const ordenConMetadatos = {
        ...nuevaOrden,
        id: nuevaOrden.id || Date.now(),
        numeroOrden: nuevaOrden.numeroOrden || `#${Math.floor(10000000 + Math.random() * 90000000)}`,
        codigoOrden: nuevaOrden.codigoOrden || `ORDER-${Date.now().toString().slice(-6)}`,
        fecha: nuevaOrden.fecha || new Date().toISOString(),
    };
    ordenes.unshift(ordenConMetadatos);
    localStorage.setItem('sv_ordenes', JSON.stringify(ordenes));
    return ordenConMetadatos;
};
