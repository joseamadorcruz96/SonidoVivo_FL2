package com.sonidovivo.ventas.controller;

import com.sonidovivo.ventas.dto.BoletaResponse;
import com.sonidovivo.ventas.dto.CrearBoletaRequest;
import com.sonidovivo.ventas.service.BoletaService;
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

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/boletas")
public class BoletaController {

    private final BoletaService boletaService;

    @PostMapping
    public ResponseEntity<BoletaResponse> crear(@Valid @RequestBody CrearBoletaRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(boletaService.crear(request));
    }

    @GetMapping
    public ResponseEntity<List<BoletaResponse>> listar() {
        return ResponseEntity.ok(boletaService.listar());
    }

    @GetMapping("/{id}")
    public ResponseEntity<BoletaResponse> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(boletaService.buscarPorId(id));
    }

    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<BoletaResponse>> listarPorUsuario(@PathVariable Long usuarioId) {
        return ResponseEntity.ok(boletaService.listarPorUsuario(usuarioId));
    }
}
