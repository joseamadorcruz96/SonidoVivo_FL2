package com.sonidovivo.usuarios.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.sonidovivo.usuarios.model.Usuario;
import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    Optional<Usuario> findByCorreoIgnoreCase(String correo);

    Optional<Usuario> findByRun(String run);

    boolean existsByCorreoIgnoreCase(String correo);

    boolean existsByRun(String run);
}