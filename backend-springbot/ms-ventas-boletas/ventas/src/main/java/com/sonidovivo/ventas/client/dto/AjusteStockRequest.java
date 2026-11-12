package com.sonidovivo.ventas.client.dto;

/** cantidadCambio negativa descuenta unidades según el contrato de inventario. */
public record AjusteStockRequest(Integer cantidadCambio) {
}
