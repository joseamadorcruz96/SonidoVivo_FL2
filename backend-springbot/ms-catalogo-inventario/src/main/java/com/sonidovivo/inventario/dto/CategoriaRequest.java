package com.sonidovivo.inventario.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CategoriaRequest {
    @NotBlank(message = "nombre es obligatorio")
    @Size(max = 100, message = "nombre no debe superar 100 caracteres")
    private String nombre;

    @Size(max = 300, message = "descripcion no debe superar 300 caracteres")
    private String descripcion;
}
