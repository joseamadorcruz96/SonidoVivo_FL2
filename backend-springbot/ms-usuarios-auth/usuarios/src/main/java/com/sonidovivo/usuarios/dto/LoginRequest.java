package com.sonidovivo.usuarios.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class LoginRequest {

    @NotBlank(message = "El correo es necesario")
    @Email(message = "Formato de correo invalido")
    private String correo;

    @NotBlank(message = "La contraseña es requerida")
    private String password;

}
