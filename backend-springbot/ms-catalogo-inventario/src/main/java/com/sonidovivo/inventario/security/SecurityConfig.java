package com.sonidovivo.inventario.security;

import jakarta.servlet.DispatcherType;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authorization.AuthorizationDecision;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http, JwtUtil jwtUtil,
                                                   @Value("${ventas.service-key}") String ventasKey)
            throws Exception {
        String productos = "/api/v1/productos";
        String categorias = "/api/v1/categorias";
        byte[] claveVentas = ventasKey.getBytes(StandardCharsets.UTF_8);

        return http
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .exceptionHandling(errors -> errors.authenticationEntryPoint(
                        (request, response, ex) ->
                                response.sendError(HttpServletResponse.SC_UNAUTHORIZED)))
                .authorizeHttpRequests(auth -> auth
                        .dispatcherTypeMatchers(DispatcherType.ERROR).permitAll()
                        .requestMatchers("/swagger-ui.html", "/swagger-ui/**",
                                "/v3/api-docs", "/v3/api-docs/**").permitAll()
                        .requestMatchers(HttpMethod.GET,
                                productos, productos + "/codigo/{codigo}",
                                categorias, categorias + "/{id}").permitAll()
                        .requestMatchers(HttpMethod.PUT, productos + "/{codigo}/stock")
                        .hasAnyRole("ADMIN", "VENDEDOR")
                        .requestMatchers(HttpMethod.PUT, "/api/v1/interno/productos/{codigo}/stock")
                        .access((authentication, context) -> {
                            String clave = context.getRequest().getHeader("X-Ventas-Key");
                            return new AuthorizationDecision(!ventasKey.isBlank() && clave != null
                                    && MessageDigest.isEqual(claveVentas, clave.getBytes(StandardCharsets.UTF_8)));
                        })
                        .requestMatchers(productos, productos + "/**",
                                categorias, categorias + "/**").hasRole("ADMIN")
                        .anyRequest().denyAll())
                .addFilterBefore(new JwtAuthenticationFilter(jwtUtil),
                        UsernamePasswordAuthenticationFilter.class)
                .build();
    }
}
