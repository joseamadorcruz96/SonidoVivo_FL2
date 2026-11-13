package com.sonidovivo.usuarios.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sonidovivo.usuarios.dto.RolUpdateRequest;
import com.sonidovivo.usuarios.dto.UsuarioResponseDto;
import com.sonidovivo.usuarios.service.UsuarioService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/usuarios")
@RequiredArgsConstructor
@Tag(name = "Usuarios", description = "Gestión administrativa de usuarios y consulta por ID")
public class UsuarioController {

    private final UsuarioService usuarioService;

    @Operation(
            summary = "Listar todos los usuarios",
            description = "Requiere rol ADMIN. Retorna la lista completa de usuarios sin exponer contraseñas",
            security = @SecurityRequirement(name = "bearerAuth")
    )
    @GetMapping
    public ResponseEntity<List<UsuarioResponseDto>> listarUsuarios() {
        return ResponseEntity.ok(usuarioService.listarUsuarios());
    }

    @Operation(
            summary = "Buscar usuario por ID",
            description = "Disponible para consulta interna vía OpenFeign o panel administrativo"
    )
    @GetMapping("/{id}")
    public ResponseEntity<UsuarioResponseDto> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(usuarioService.buscarPorId(id));
    }

    @Operation(
            summary = "Actualizar rol de usuario",
            description = "Requiere rol ADMIN. Cambia el rol entre ADMIN, VENDEDOR o CLIENTE",
            security = @SecurityRequirement(name = "bearerAuth")
    )
    @PutMapping("/{id}/rol")
    public ResponseEntity<UsuarioResponseDto> actualizarRol(
            @PathVariable Long id,
            @Valid @RequestBody RolUpdateRequest request) {
        return ResponseEntity.ok(usuarioService.actualizarRol(id, request.getRol()));
    }

    @Operation(
            summary = "Eliminar usuario",
            description = "Requiere rol ADMIN. Elimina la cuenta del usuario por su ID",
            security = @SecurityRequirement(name = "bearerAuth")
    )
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> borrarUsuario(@PathVariable Long id) {
        usuarioService.borrarUsuario(id);
        return ResponseEntity.noContent().build();
    }

}
