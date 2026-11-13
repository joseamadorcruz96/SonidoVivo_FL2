package com.sonidovivo.usuarios.security;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import com.sonidovivo.usuarios.model.Rol;

class JwtUtilTest {

    private JwtUtil jwtUtil;

    @BeforeEach
    void setUp() {
        jwtUtil = new JwtUtil();
        ReflectionTestUtils.setField(
                jwtUtil,
                "jwtSecret",
                "TestOnlyJwtSecretKeyNotUsedInProduction2026SonidoVivo123456"
        );
        ReflectionTestUtils.setField(jwtUtil, "jwtExpirationMs", 86400000L);
    }

    @Test
    void generarToken_yExtraerDatos_retornaCorreoYRolEsperados() {
        String token = jwtUtil.generarToken(3L, "admin@gmail.com", Rol.ADMIN);

        assertTrue(jwtUtil.esTokenValido(token));
        assertEquals("admin@gmail.com", jwtUtil.extraerCorreo(token));
        assertEquals("ADMIN", jwtUtil.extraerRol(token));
    }

    @Test
    void esTokenValido_cuandoTokenEsAlterado_retornaFalse() {
        String token = jwtUtil.generarToken(1L, "cliente@gmail.com", Rol.CLIENTE);
        String tokenAlterado = token.substring(0, token.length() - 2) + "xx";

        assertFalse(jwtUtil.esTokenValido(tokenAlterado));
    }
}
