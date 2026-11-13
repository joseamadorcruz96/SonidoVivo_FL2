package com.sonidovivo.usuarios.dto;

import org.springframework.stereotype.Component;

import com.sonidovivo.usuarios.model.Usuario;

@Component
public class UsuarioMapper {

    public UsuarioResponseDto toResponseDto(Usuario usuario) {
        if (usuario == null) {
            return null;
        }

        return UsuarioResponseDto.builder()
                .idUsuario(usuario.getIdUsuario())
                .run(usuario.getRun())
                .nombre(usuario.getNombre())
                .apellido(usuario.getApellido())
                .correo(usuario.getCorreo())
                .rol(usuario.getRol())
                .numeroContacto(usuario.getNumeroContacto())
                .region(usuario.getRegion())
                .comuna(usuario.getComuna())
                .direccion(usuario.getDireccion())
                .fechaNacimiento(usuario.getFechaNacimiento())
                .fechaCreacion(usuario.getFechaCreacion())
                .build();
    }

    public Usuario toEntity(UsuarioRequestDto dto) {
        if (dto == null) {
            return null;
        }

        return Usuario.builder()
                .run(dto.getRun())
                .nombre(dto.getNombre())
                .apellido(dto.getApellido())
                .correo(dto.getCorreo())
                .password(null)
                .numeroContacto(dto.getNumeroContacto())
                .region(dto.getRegion())
                .comuna(dto.getComuna())
                .direccion(dto.getDireccion())
                .fechaNacimiento(dto.getFechaNacimiento())
                .build();
    }
}
