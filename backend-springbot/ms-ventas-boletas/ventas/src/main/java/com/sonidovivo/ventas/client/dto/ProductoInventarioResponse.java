package com.sonidovivo.ventas.client.dto;

/** Campos de producto que ventas necesita leer desde ms-catalogo-inventario. */
public record ProductoInventarioResponse(
        String codigo,
        String nombre,
        Integer precio,
        Integer stock,
        String imagen
) {
}
