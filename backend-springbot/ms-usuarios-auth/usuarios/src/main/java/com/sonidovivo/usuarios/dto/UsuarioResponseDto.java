package com.sonidovivo.usuarios.dto;

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
    private String nombre;
    private String correo;
    private Rol rol;

}
