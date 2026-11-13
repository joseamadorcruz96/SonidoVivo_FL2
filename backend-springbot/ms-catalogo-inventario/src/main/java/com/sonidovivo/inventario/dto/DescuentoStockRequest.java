package com.sonidovivo.inventario.dto;

import jakarta.validation.constraints.Negative;
import jakarta.validation.constraints.NotNull;

public record DescuentoStockRequest(
        @NotNull(message = "La cantidad de ajuste es obligatoria")
        @Negative(message = "El descuento requiere una cantidad negativa")
        Integer cantidadCambio
) {
}
