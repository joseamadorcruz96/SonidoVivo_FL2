package com.sonidovivo.inventario.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProductoActualizacionRequest {
    @NotBlank(message = "El nombre es obligatorio")
    @Size(max = 100, message = "El nombre no debe superar 100 caracteres")
    private String nombre;

    @NotBlank(message = "La marca es obligatoria")
    @Size(max = 60, message = "La marca no debe superar 60 caracteres")
    private String marca;

    @Size(max = 60, message = "El modelo no debe superar 60 caracteres")
    private String modelo;

    @NotNull(message = "El precio es obligatorio")
    @PositiveOrZero(message = "El precio debe ser mayor o igual a cero")
    private Integer precio;

    @NotNull(message = "El stock crítico es obligatorio")
    @PositiveOrZero(message = "El stock crítico debe ser mayor o igual a cero")
    private Integer stockCritico;

    @Size(max = 500, message = "La descripción no debe superar 500 caracteres")
    private String descripcion;

    @Size(max = 2048, message = "La imagen no debe superar 2048 caracteres")
    private String imagen;

    private boolean destacado;

    @NotNull(message = "La categoría es obligatoria")
    @Positive(message = "El ID de la categoría debe ser positivo")
    private Long categoriaId;
}
