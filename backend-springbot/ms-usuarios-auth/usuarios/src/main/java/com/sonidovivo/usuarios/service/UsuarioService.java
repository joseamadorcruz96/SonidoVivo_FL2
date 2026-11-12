package com.sonidovivo.usuarios.service;

import java.util.List;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.sonidovivo.usuarios.dto.UsuarioMapper;
import com.sonidovivo.usuarios.dto.UsuarioRequestDto;
import com.sonidovivo.usuarios.dto.UsuarioResponseDto;
import com.sonidovivo.usuarios.exception.ResourceNotFoundException;
import com.sonidovivo.usuarios.model.Rol;
import com.sonidovivo.usuarios.model.Usuario;
import com.sonidovivo.usuarios.repository.UsuarioRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final UsuarioMapper usuarioMapper;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public UsuarioResponseDto agregarUsuario(UsuarioRequestDto dto) {

        // reglas de unicidad
        if (usuarioRepository.existsByRun(dto.getRun())) {
            throw new IllegalArgumentException("El run ya se encuentra registrado");
        }
        if (usuarioRepository.existsByCorreoIgnoreCase(dto.getCorreo())) {
            throw new IllegalArgumentException("El correo ya se encuentra registrado");
        }
        // mapeo a entidad
        Usuario nuevoUsuario = usuarioMapper.toEntity(dto);

        // seguridad
        nuevoUsuario.setPassword(passwordEncoder.encode(dto.getPassword()));
        nuevoUsuario.setRol(Rol.CLIENTE);

        // guardar y devolver dto
        Usuario guardado = usuarioRepository.save(nuevoUsuario);
        return usuarioMapper.toResponseDto(guardado);
    }

    @Transactional(readOnly = true)
    public List<UsuarioResponseDto> listarUsuarios() {
        return usuarioRepository.findAll()
                .stream()
                .map(usuarioMapper::toResponseDto)
                .toList();
    }

    @Transactional(readOnly = true)
    public UsuarioResponseDto buscarPorId(Long id) {
        Usuario encontrado = usuarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("usuario no encontrado"));
        return usuarioMapper.toResponseDto(encontrado);
    }

    @Transactional
    public UsuarioResponseDto actualizarRol(Long id, Rol rol) {
        if (rol == null) {
            throw new IllegalArgumentException("por implementar");
        }
        Usuario encontrado = usuarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("usuario no encontrado"));
        encontrado.setRol(rol);
        Usuario actualizado = usuarioRepository.save(encontrado);
        return usuarioMapper.toResponseDto(actualizado);
    }

    @Transactional
    public void borrarUsuario(Long id) {
        if (!usuarioRepository.existsById(id)) {
            throw new ResourceNotFoundException("usuario no encontrado");
        }
        usuarioRepository.deleteById(id);
    }
}