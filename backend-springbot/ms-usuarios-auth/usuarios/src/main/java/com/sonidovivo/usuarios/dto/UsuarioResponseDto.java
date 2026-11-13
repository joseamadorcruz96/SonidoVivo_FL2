package com.sonidovivo.usuarios.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

import com.sonidovivo.usuarios.model.Rol;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UsuarioResponseDto {

    private Long idUsuario;
    private String run;
    private String nombre;
    private String apellido;
    private String correo;
    private Rol rol;
    private String numeroContacto;
    private String region;
    private String comuna;
    private String direccion;
    private LocalDate fechaNacimiento;
    private LocalDateTime fechaCreacion;

}
