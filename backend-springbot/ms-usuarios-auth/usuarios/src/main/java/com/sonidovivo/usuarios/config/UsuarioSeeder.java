package com.sonidovivo.usuarios.config;

import java.time.LocalDate;

import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.sonidovivo.usuarios.model.Rol;
import com.sonidovivo.usuarios.model.Usuario;
import com.sonidovivo.usuarios.repository.UsuarioRepository;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class UsuarioSeeder implements CommandLineRunner {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        sembrarSiNoExiste("19011021K", "Pedro", "Cliente", "cliente@gmail.com",
                Rol.CLIENTE, "123", LocalDate.of(1995, 3, 15),
                "+56911112222", "Metropolitana", "Santiago", "Av. Libertador 101");

        sembrarSiNoExiste("185554443", "Ana", "Vendedora", "vendedor@gmail.com",
                Rol.VENDEDOR, "123", LocalDate.of(1993, 7, 22),
                "+56922223333", "Metropolitana", "Providencia", "Av. Providencia 450");

        sembrarSiNoExiste("172223334", "Admin", "Master", "admin@gmail.com",
                Rol.ADMIN, "123", LocalDate.of(1990, 1, 10),
                "+56933334444", "Metropolitana", "Las Condes", "Av. Apoquindo 1200");

        sembrarSiNoExiste("164445556", "Hernán", "Admin", "admin@sonidovivo.cl",
                Rol.ADMIN, "admin123", LocalDate.of(1988, 11, 5),
                "+56944445555", "Valparaíso", "Viña del Mar", "Av. Libertad 800");

        sembrarSiNoExiste("159998887", "Rodrigo", "Vendedor", "vendedor@sonidovivo.cl",
                Rol.VENDEDOR, "ventas123", LocalDate.of(1992, 6, 18),
                "+56955556666", "Biobío", "Concepción", "Av. O'Higgins 320");
    }

    private void sembrarSiNoExiste(
            String run,
            String nombre,
            String apellido,
            String correo,
            Rol rol,
            String password,
            LocalDate fechaNacimiento,
            String numeroContacto,
            String region,
            String comuna,
            String direccion) {
        if (!usuarioRepository.existsByCorreoIgnoreCase(correo) && !usuarioRepository.existsByRun(run)) {
            Usuario usuario = Usuario.builder()
                    .run(run)
                    .nombre(nombre)
                    .apellido(apellido)
                    .correo(correo)
                    .rol(rol)
                    .password(passwordEncoder.encode(password))
                    .fechaNacimiento(fechaNacimiento)
                    .numeroContacto(numeroContacto)
                    .region(region)
                    .comuna(comuna)
                    .direccion(direccion)
                    .build();

            usuarioRepository.save(usuario);
        }
    }

}
