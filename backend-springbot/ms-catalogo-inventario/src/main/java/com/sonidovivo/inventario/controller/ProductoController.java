package com.sonidovivo.inventario.controller;

import com.sonidovivo.inventario.dto.ProductoActualizacionRequest;
import com.sonidovivo.inventario.dto.ProductoRequest;
import com.sonidovivo.inventario.dto.ProductoResponse;
import com.sonidovivo.inventario.service.ProductoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/productos")
public class ProductoController {

    private final ProductoService productoService;

    @GetMapping
    public ResponseEntity<List<ProductoResponse>> listar(){
        return ResponseEntity.ok(productoService.listar());
    }

    @GetMapping("/codigo/{codigo}")
    public ResponseEntity<ProductoResponse> buscarPorCodigo(@PathVariable String codigo){
        return ResponseEntity.ok(productoService.buscarPorCodigo(codigo));
    }

    @PostMapping
    public ResponseEntity<ProductoResponse> crear(@Valid @RequestBody ProductoRequest request){
        return ResponseEntity.status(HttpStatus.CREATED).body(productoService.crear(request));
    }

    @PutMapping("/{codigo}")
    public ResponseEntity<ProductoResponse> actualizar(@PathVariable String codigo,
                                                       @Valid @RequestBody ProductoActualizacionRequest request){
        return ResponseEntity.ok(productoService.actualizar(codigo, request));
    }

    @DeleteMapping("/{codigo}")
    public ResponseEntity<Void> eliminar(@PathVariable String codigo){
        productoService.eliminar(codigo);
        return ResponseEntity.noContent().build();
    }
}
