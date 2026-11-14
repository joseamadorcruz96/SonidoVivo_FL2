package com.sonidovivo.ventas.controller;

import com.sonidovivo.ventas.dto.BoletaResponse;
import com.sonidovivo.ventas.dto.CrearBoletaRequest;
import com.sonidovivo.ventas.service.BoletaService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Tag(name = "Boletas", description = "Registro de compras y consulta de órdenes.")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/boletas")
public class BoletaController {

    private final BoletaService boletaService;

    @Operation(summary = "Registrar compra", description = "Admite invitados si omiten usuarioId. Un cliente autenticado queda asociado a la compra mediante su JWT. Ventas consulta los precios en Catálogo, valida las cantidades y solicita el descuento de stock.")
    @ApiResponse(responseCode = "201", description = "Boleta creada", useReturnTypeSchema = true)
    @ApiResponse(responseCode = "400", description = "Datos inválidos o stock insuficiente", content = @Content)
    @ApiResponse(responseCode = "401", description = "Se requiere autenticación para enviar usuarioId", content = @Content)
    @ApiResponse(responseCode = "403", description = "El cliente intenta comprar para otro usuario", content = @Content)
    @ApiResponse(responseCode = "404", description = "Producto o usuario inexistente", content = @Content)
    @PostMapping
    public ResponseEntity<BoletaResponse> crear(@Valid @RequestBody CrearBoletaRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(boletaService.crear(request));
    }

    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Listar boletas", description = "ADMIN y VENDEDOR. Devuelve las boletas desde la más reciente.")
    @ApiResponse(responseCode = "200", description = "Listado de boletas", useReturnTypeSchema = true)
    @ApiResponse(responseCode = "401", description = "Autenticación requerida", content = @Content)
    @ApiResponse(responseCode = "403", description = "Rol sin acceso al listado", content = @Content)
    @GetMapping
    public ResponseEntity<List<BoletaResponse>> listar() {
        return ResponseEntity.ok(boletaService.listar());
    }

    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Consultar boleta por ID", description = "ADMIN y VENDEDOR pueden consultar cualquier boleta. CLIENTE solo puede consultar las suyas.")
    @ApiResponse(responseCode = "200", description = "Boleta encontrada", useReturnTypeSchema = true)
    @ApiResponse(responseCode = "401", description = "Autenticación requerida", content = @Content)
    @ApiResponse(responseCode = "403", description = "La boleta no pertenece al cliente", content = @Content)
    @ApiResponse(responseCode = "404", description = "Boleta inexistente", content = @Content)
    @GetMapping("/{id}")
    public ResponseEntity<BoletaResponse> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(boletaService.buscarPorId(id));
    }

    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Consultar historial de compras", description = "ADMIN puede consultar el historial de cualquier usuario. CLIENTE solo puede consultar el propio.")
    @ApiResponse(responseCode = "200", description = "Historial de boletas", useReturnTypeSchema = true)
    @ApiResponse(responseCode = "401", description = "Autenticación requerida", content = @Content)
    @ApiResponse(responseCode = "403", description = "Acceso denegado al historial", content = @Content)
    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<BoletaResponse>> listarPorUsuario(@PathVariable Long usuarioId) {
        return ResponseEntity.ok(boletaService.listarPorUsuario(usuarioId));
    }
}
