package com.sonidovivo.usuarios.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.sonidovivo.usuarios.dto.AuthResponse;
import com.sonidovivo.usuarios.dto.LoginRequest;
import com.sonidovivo.usuarios.dto.UsuarioMapper;
import com.sonidovivo.usuarios.dto.UsuarioRequestDto;
import com.sonidovivo.usuarios.dto.UsuarioResponseDto;
import com.sonidovivo.usuarios.model.Rol;
import com.sonidovivo.usuarios.model.Usuario;
import com.sonidovivo.usuarios.repository.UsuarioRepository;
import com.sonidovivo.usuarios.security.JwtUtil;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UsuarioRepository usuarioRepository;

    @Mock
    private UsuarioService usuarioService;

    @Mock
    private UsuarioMapper usuarioMapper;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtUtil jwtUtil;

    @InjectMocks
    private AuthService authService;

    private Usuario usuarioEntidad;
    private UsuarioResponseDto usuarioDto;

    @BeforeEach
    void setUp() {
        usuarioEntidad = Usuario.builder()
                .idUsuario(3L)
                .nombre("Admin")
                .apellido("Master")
                .correo("admin@gmail.com")
                .rol(Rol.ADMIN)
                .password("$2a$10$encodedAdminPass")
                .build();

        usuarioDto = UsuarioResponseDto.builder()
                .idUsuario(3L)
                .nombre("Admin")
                .apellido("Master")
                .correo("admin@gmail.com")
                .rol(Rol.ADMIN)
                .build();
    }

    @Test
    void register_cuandoDatosValidos_creaUsuarioYEmiteJwt() {
        UsuarioRequestDto request = UsuarioRequestDto.builder()
                .correo("nuevo@gmail.com")
                .password("1234")
                .build();

        UsuarioResponseDto creado = UsuarioResponseDto.builder()
                .idUsuario(10L)
                .correo("nuevo@gmail.com")
                .rol(Rol.CLIENTE)
                .build();

        when(usuarioService.agregarUsuario(request)).thenReturn(creado);
        when(jwtUtil.generarToken(10L, "nuevo@gmail.com", Rol.CLIENTE)).thenReturn("jwt-registro-ok");

        AuthResponse response = authService.register(request);

        assertNotNull(response);
        assertEquals("jwt-registro-ok", response.getToken());
        assertEquals(Rol.CLIENTE, response.getUsuario().getRol());
        verify(jwtUtil).generarToken(10L, "nuevo@gmail.com", Rol.CLIENTE);
    }

    @Test
    void login_cuandoCredencialesValidas_retornaTokenYUsuario() {
        LoginRequest request = new LoginRequest("admin@gmail.com", "123");

        when(usuarioRepository.findByCorreoIgnoreCase("admin@gmail.com"))
                .thenReturn(Optional.of(usuarioEntidad));
        when(passwordEncoder.matches("123", "$2a$10$encodedAdminPass")).thenReturn(true);
        when(jwtUtil.generarToken(3L, "admin@gmail.com", Rol.ADMIN)).thenReturn("jwt-admin-ok");
        when(usuarioMapper.toResponseDto(usuarioEntidad)).thenReturn(usuarioDto);

        AuthResponse response = authService.login(request);

        assertNotNull(response);
        assertEquals("jwt-admin-ok", response.getToken());
        assertEquals("admin@gmail.com", response.getUsuario().getCorreo());
        assertEquals(Rol.ADMIN, response.getUsuario().getRol());
    }

    @Test
    void login_cuandoCorreoNoExiste_lanzaBadCredentialsException() {
        LoginRequest request = new LoginRequest("noexiste@gmail.com", "123");
        when(usuarioRepository.findByCorreoIgnoreCase("noexiste@gmail.com")).thenReturn(Optional.empty());

        BadCredentialsException ex = assertThrows(
                BadCredentialsException.class,
                () -> authService.login(request)
        );

        assertEquals("Correo o contraseña incorrectos", ex.getMessage());
        verifyNoInteractions(passwordEncoder, jwtUtil);
    }

    @Test
    void login_cuandoPasswordIncorrecta_lanzaBadCredentialsException() {
        LoginRequest request = new LoginRequest("admin@gmail.com", "incorrecta");

        when(usuarioRepository.findByCorreoIgnoreCase("admin@gmail.com"))
                .thenReturn(Optional.of(usuarioEntidad));
        when(passwordEncoder.matches("incorrecta", "$2a$10$encodedAdminPass")).thenReturn(false);

        BadCredentialsException ex = assertThrows(
                BadCredentialsException.class,
                () -> authService.login(request)
        );

        assertEquals("Correo o contraseña incorrectos", ex.getMessage());
        verifyNoInteractions(jwtUtil);
    }
}
