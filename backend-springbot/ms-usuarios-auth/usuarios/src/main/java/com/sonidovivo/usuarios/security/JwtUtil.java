package com.sonidovivo.usuarios.security;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.sonidovivo.usuarios.model.Rol;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String jwtSecret;

    @Value("${jwt.expiration}")
    private long jwtExpirationMs;

    private Key obtenerLlaveFirma() {
        byte[] keyBytes = jwtSecret.getBytes(StandardCharsets.UTF_8);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    public String generarToken(Long idUsuario, String correo, Rol rol) {
        Map<String, Object> claimsExtra = new HashMap<>();
        claimsExtra.put("id", idUsuario);
        claimsExtra.put("rol", String.valueOf(rol));
        Date ahora = new Date();
        Date expiracion = new Date(ahora.getTime() + jwtExpirationMs);
        return Jwts.builder()
                .setClaims(claimsExtra)
                .setSubject(correo)
                .setIssuedAt(ahora)
                .setExpiration(expiracion)
                .signWith(obtenerLlaveFirma(), SignatureAlgorithm.HS256)
                .compact();
    }

    public String extraerCorreo(String token) {
        return extraerClaim(token, Claims::getSubject);
    }

    public String extraerRol(String token) {
        return extraerTodasLasClaims(token).get("rol", String.class);
    }

    public boolean esTokenValido(String token) {
        try {
            Claims claims = extraerTodasLasClaims(token);
            return claims.getExpiration().after(new Date());
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    private <T> T extraerClaim(String token, Function<Claims, T> resolver) {
        Claims claims = extraerTodasLasClaims(token);
        return resolver.apply(claims);
    }

    private Claims extraerTodasLasClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(obtenerLlaveFirma())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

}
