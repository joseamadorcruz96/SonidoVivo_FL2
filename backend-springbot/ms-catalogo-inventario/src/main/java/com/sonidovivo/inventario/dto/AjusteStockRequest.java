package com.sonidovivo.inventario.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AjusteStockRequest {
    @NotNull(message = "La cantidad de ajuste es obligatoria")
    @Schema(description = "Variación de unidades del stock", example = "-1")
    private Integer cantidadCambio;
}
