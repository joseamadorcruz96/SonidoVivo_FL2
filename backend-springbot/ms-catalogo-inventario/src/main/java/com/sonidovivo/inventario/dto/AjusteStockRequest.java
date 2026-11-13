package com.sonidovivo.inventario.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AjusteStockRequest {
    @NotNull(message = "La cantidad de ajuste es obligatoria")
    private Integer cantidadCambio;
}
