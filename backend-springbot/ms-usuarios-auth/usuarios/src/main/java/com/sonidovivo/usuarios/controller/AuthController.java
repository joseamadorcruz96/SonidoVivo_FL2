package com.sonidovivo.usuarios.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sonidovivo.usuarios.dto.AuthResponse;
import com.sonidovivo.usuarios.dto.LoginRequest;
import com.sonidovivo.usuarios.dto.UsuarioRequestDto;
import com.sonidovivo.usuarios.service.AuthService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@Tag(name = "Autenticación", description = "Registro e inicio de sesión con emisión de JWT")
public class AuthController {

    private final AuthService authService;

    @Operation(summary = "Iniciar sesión", description = "Valida credenciales con BCrypt y retorna el token JWT junto al usuario autenticado")
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @Operation(summary = "Registrar usuario", description = "Crea un nuevo usuario con rol CLIENTE, encripta su contraseña y retorna el JWT inicial")
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody UsuarioRequestDto request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(authService.register(request));
    }

}
