package com.sonidovivo.ventas.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.JwtParser;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;

@Component
public class JwtUtil {

    private final JwtParser parser;

    public JwtUtil(@Value("${jwt.secret}") String secret) {
        this.parser = Jwts.parserBuilder()
                .setSigningKey(Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8)))
                .build();
    }

    public Claims validarToken(String token) {
        Claims claims = parser.parseClaimsJws(token).getBody();
        if (claims.getExpiration() == null) {
            throw new JwtException("El token no tiene fecha de expiración");
        }
        return claims;
    }
}
