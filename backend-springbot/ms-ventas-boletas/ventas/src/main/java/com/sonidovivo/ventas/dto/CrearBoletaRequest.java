package com.sonidovivo.ventas.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Email;

import java.util.List;

/** Datos del checkout necesarios para solicitar una boleta. */
public record CrearBoletaRequest(
        @Positive Long usuarioId,
        @NotNull @Valid ClienteRequest cliente,
        @NotNull @Valid DireccionRequest direccion,
        @NotEmpty List<@NotNull @Valid ItemRequest> items
) {

    public record ClienteRequest(
            @NotBlank String nombre,
            @NotBlank String apellidos,
            @NotBlank @Email String email
    ) {
    }

    public record DireccionRequest(
            @NotBlank String calle,
            String departamento,
            @NotBlank String region,
            @NotBlank String comuna,
            String indicaciones
    ) {
    }

    /** El precio, nombre y total del navegador no son datos autoritativos. */
    public record ItemRequest(
            @NotBlank String codigo,
            @NotNull @Min(1) Integer cantidad
    ) {
    }
}
