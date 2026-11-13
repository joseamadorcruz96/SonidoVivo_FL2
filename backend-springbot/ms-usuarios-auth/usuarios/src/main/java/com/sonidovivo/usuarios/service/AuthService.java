package com.sonidovivo.usuarios.service;

import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.sonidovivo.usuarios.dto.AuthResponse;
import com.sonidovivo.usuarios.dto.LoginRequest;
import com.sonidovivo.usuarios.dto.UsuarioMapper;
import com.sonidovivo.usuarios.dto.UsuarioRequestDto;
import com.sonidovivo.usuarios.dto.UsuarioResponseDto;
import com.sonidovivo.usuarios.model.Usuario;
import com.sonidovivo.usuarios.repository.UsuarioRepository;
import com.sonidovivo.usuarios.security.JwtUtil;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final UsuarioService usuarioService;
    private final UsuarioMapper usuarioMapper;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @Transactional
    public AuthResponse register(UsuarioRequestDto request) {
        UsuarioResponseDto creado = usuarioService.agregarUsuario(request);
        String token = jwtUtil.generarToken(creado.getIdUsuario(), creado.getCorreo(), creado.getRol());
        return AuthResponse.builder()
                .token(token)
                .usuario(creado)
                .build();
    }

    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        Usuario usuario = usuarioRepository.findByCorreoIgnoreCase(request.getCorreo())
                .orElseThrow(() -> new BadCredentialsException("Correo o contraseña incorrectos"));

        if (!passwordEncoder.matches(request.getPassword(), usuario.getPassword())) {
            throw new BadCredentialsException("Correo o contraseña incorrectos");
        }

        String token = jwtUtil.generarToken(usuario.getIdUsuario(), usuario.getCorreo(), usuario.getRol());
        return AuthResponse.builder()
                .token(token)
                .usuario(usuarioMapper.toResponseDto(usuario))
                .build();
    }

}
