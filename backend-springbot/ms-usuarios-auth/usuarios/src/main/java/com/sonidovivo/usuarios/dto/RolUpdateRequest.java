package com.sonidovivo.usuarios.dto;

import com.sonidovivo.usuarios.model.Rol;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RolUpdateRequest {

    @NotNull(message = "El rol es obligatorio")
    private Rol rol;

}
