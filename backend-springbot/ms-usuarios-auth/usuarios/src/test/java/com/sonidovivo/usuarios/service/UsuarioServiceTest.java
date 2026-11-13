package com.sonidovivo.usuarios.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.sonidovivo.usuarios.dto.UsuarioMapper;
import com.sonidovivo.usuarios.dto.UsuarioRequestDto;
import com.sonidovivo.usuarios.dto.UsuarioResponseDto;
import com.sonidovivo.usuarios.exception.ResourceNotFoundException;
import com.sonidovivo.usuarios.model.Rol;
import com.sonidovivo.usuarios.model.Usuario;
import com.sonidovivo.usuarios.repository.UsuarioRepository;

@ExtendWith(MockitoExtension.class)
class UsuarioServiceTest {

    @Mock
    private UsuarioRepository usuarioRepository;

    @Mock
    private UsuarioMapper usuarioMapper;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UsuarioService usuarioService;

    private UsuarioRequestDto requestDto;
    private Usuario usuarioEntidad;
    private UsuarioResponseDto responseDto;

    @BeforeEach
    void setUp() {
        requestDto = UsuarioRequestDto.builder()
                .run("19011021K")
                .nombre("Pedro")
                .apellido("Cliente")
                .correo("pedro@gmail.com")
                .password("clave123")
                .numeroContacto("+56911112222")
                .region("Metropolitana")
                .comuna("Santiago")
                .direccion("Av. Libertador 101")
                .fechaNacimiento(LocalDate.of(1995, 3, 15))
                .build();

        usuarioEntidad = Usuario.builder()
                .idUsuario(1L)
                .run("19011021K")
                .nombre("Pedro")
                .apellido("Cliente")
                .correo("pedro@gmail.com")
                .rol(Rol.CLIENTE)
                .password("$2a$10$hashedPassword")
                .region("Metropolitana")
                .comuna("Santiago")
                .direccion("Av. Libertador 101")
                .fechaNacimiento(LocalDate.of(1995, 3, 15))
                .build();

        responseDto = UsuarioResponseDto.builder()
                .idUsuario(1L)
                .run("19011021K")
                .nombre("Pedro")
                .apellido("Cliente")
                .correo("pedro@gmail.com")
                .rol(Rol.CLIENTE)
                .build();
    }

    @Test
    void agregarUsuario_cuandoDatosValidos_encriptaPasswordAsignaClienteYRetornaDto() {
        Usuario entidadSinGuardar = Usuario.builder()
                .run("19011021K")
                .nombre("Pedro")
                .apellido("Cliente")
                .correo("pedro@gmail.com")
                .build();

        when(usuarioRepository.existsByRun("19011021K")).thenReturn(false);
        when(usuarioRepository.existsByCorreoIgnoreCase("pedro@gmail.com")).thenReturn(false);
        when(usuarioMapper.toEntity(requestDto)).thenReturn(entidadSinGuardar);
        when(passwordEncoder.encode("clave123")).thenReturn("$2a$10$hashedPassword");
        when(usuarioRepository.save(any(Usuario.class))).thenReturn(usuarioEntidad);
        when(usuarioMapper.toResponseDto(usuarioEntidad)).thenReturn(responseDto);

        UsuarioResponseDto resultado = usuarioService.agregarUsuario(requestDto);

        ArgumentCaptor<Usuario> usuarioCaptor = ArgumentCaptor.forClass(Usuario.class);
        verify(usuarioRepository).save(usuarioCaptor.capture());

        assertEquals("$2a$10$hashedPassword", usuarioCaptor.getValue().getPassword());
        assertEquals(Rol.CLIENTE, usuarioCaptor.getValue().getRol());
        assertNotNull(resultado);
        assertEquals(1L, resultado.getIdUsuario());
        assertEquals("pedro@gmail.com", resultado.getCorreo());
        verify(passwordEncoder).encode("clave123");
    }

    @Test
    void agregarUsuario_cuandoCorreoDuplicado_lanzaIllegalArgumentExceptionYNoGuarda() {
        when(usuarioRepository.existsByRun("19011021K")).thenReturn(false);
        when(usuarioRepository.existsByCorreoIgnoreCase("pedro@gmail.com")).thenReturn(true);

        IllegalArgumentException ex = assertThrows(
                IllegalArgumentException.class,
                () -> usuarioService.agregarUsuario(requestDto)
        );

        assertEquals("El correo ya se encuentra registrado", ex.getMessage());
        verifyNoInteractions(passwordEncoder);
        verify(usuarioRepository, never()).save(any());
    }

    @Test
    void agregarUsuario_cuandoRunDuplicado_lanzaIllegalArgumentExceptionYNoGuarda() {
        when(usuarioRepository.existsByRun("19011021K")).thenReturn(true);

        IllegalArgumentException ex = assertThrows(
                IllegalArgumentException.class,
                () -> usuarioService.agregarUsuario(requestDto)
        );

        assertEquals("El run ya se encuentra registrado", ex.getMessage());
        verifyNoInteractions(passwordEncoder);
        verify(usuarioRepository, never()).save(any());
    }

    @Test
    void listarUsuarios_retornaListaMapeada() {
        when(usuarioRepository.findAll()).thenReturn(List.of(usuarioEntidad));
        when(usuarioMapper.toResponseDto(usuarioEntidad)).thenReturn(responseDto);

        List<UsuarioResponseDto> lista = usuarioService.listarUsuarios();

        assertEquals(1, lista.size());
        assertEquals("pedro@gmail.com", lista.get(0).getCorreo());
    }

    @Test
    void buscarPorId_cuandoNoExiste_lanzaResourceNotFoundException() {
        when(usuarioRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> usuarioService.buscarPorId(99L));
    }

    @Test
    void actualizarRol_cuandoExiste_actualizaRolYGuarda() {
        UsuarioResponseDto actualizadoDto = UsuarioResponseDto.builder()
                .idUsuario(1L)
                .correo("pedro@gmail.com")
                .rol(Rol.VENDEDOR)
                .build();

        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(usuarioEntidad));
        when(usuarioRepository.save(usuarioEntidad)).thenReturn(usuarioEntidad);
        when(usuarioMapper.toResponseDto(usuarioEntidad)).thenReturn(actualizadoDto);

        UsuarioResponseDto resultado = usuarioService.actualizarRol(1L, Rol.VENDEDOR);

        assertEquals(Rol.VENDEDOR, usuarioEntidad.getRol());
        assertEquals(Rol.VENDEDOR, resultado.getRol());
        verify(usuarioRepository).save(usuarioEntidad);
    }

    @Test
    void actualizarRol_cuandoRolEsNull_lanzaIllegalArgumentException() {
        assertThrows(IllegalArgumentException.class, () -> usuarioService.actualizarRol(1L, null));
        verify(usuarioRepository, never()).save(any());
    }

    @Test
    void borrarUsuario_cuandoNoExiste_lanzaResourceNotFoundException() {
        when(usuarioRepository.existsById(99L)).thenReturn(false);

        assertThrows(ResourceNotFoundException.class, () -> usuarioService.borrarUsuario(99L));
        verify(usuarioRepository, never()).deleteById(any());
    }
}
