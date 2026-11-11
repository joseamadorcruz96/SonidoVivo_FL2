package com.sonidovivo.usuarios.dto;

import java.time.LocalDate;

import com.sonidovivo.usuarios.utils.ValidRut;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UsuarioRequestDto {

    @NotBlank(message = "El run es invalido")
    @ValidRut
    private String run;
    @NotBlank(message = "El nombre es necesario")
    private String nombre;
    @NotBlank(message = "El apellido es necesario")
    private String apellido;
    @NotBlank(message = "El correo es necesario")
    @Email(message = "formato de correo invalido")
    private String correo;
    @NotBlank
    @Size(min = 4, max = 20, message = "La contraseña debe tener entre 4 y 20 caracteres")
    private String password;
    private String numeroContacto;
    @NotBlank(message = "La region es requerida")
    private String region;
    @NotBlank(message = "La comuna es requerida")
    private String comuna;
    @NotBlank(message = "La direccion es requerida")
    private String direccion;
    @NotNull(message = "La fecha de nacimiento es obligatoria")
    @Past(message = "La fecha de nacimiento debe ser en el pasado")
    private LocalDate fechaNacimiento;

}
