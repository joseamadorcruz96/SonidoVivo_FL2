package com.sonidovivo.ventas.client.dto;

/** Respuesta de usuario basada en los campos del microservicio de identidad. */
public record UsuarioRemotoResponse(
        Long idUsuario,
        String nombre,
        String apellido,
        String correo
) {
}
