package com.sonidovivo.inventario.controller;

import com.sonidovivo.inventario.dto.AjusteStockRequest;
import com.sonidovivo.inventario.dto.DescuentoStockRequest;
import com.sonidovivo.inventario.dto.ProductoActualizacionRequest;
import com.sonidovivo.inventario.dto.ProductoRequest;
import com.sonidovivo.inventario.dto.ProductoResponse;
import com.sonidovivo.inventario.service.ProductoService;
import io.swagger.v3.oas.annotations.Hidden;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
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
@RequestMapping("/api/v1")
public class ProductoController {

    private final ProductoService productoService;

    @GetMapping("/productos")
    public ResponseEntity<List<ProductoResponse>> listar(){
        return ResponseEntity.ok(productoService.listar());
    }

    @GetMapping("/productos/codigo/{codigo}")
    public ResponseEntity<ProductoResponse> buscarPorCodigo(@PathVariable String codigo){
        return ResponseEntity.ok(productoService.buscarPorCodigo(codigo));
    }

    @SecurityRequirement(name = "bearerAuth")
    @PostMapping("/productos")
    public ResponseEntity<ProductoResponse> crear(@Valid @RequestBody ProductoRequest request){
        return ResponseEntity.status(HttpStatus.CREATED).body(productoService.crear(request));
    }

    @SecurityRequirement(name = "bearerAuth")
    @PutMapping("/productos/{codigo}")
    public ResponseEntity<ProductoResponse> actualizar(@PathVariable String codigo,
                                                       @Valid @RequestBody ProductoActualizacionRequest request){
        return ResponseEntity.ok(productoService.actualizar(codigo, request));
    }

    @SecurityRequirement(name = "bearerAuth")
    @PutMapping("/productos/{codigo}/stock")
    public ResponseEntity<ProductoResponse> ajustarStock(@PathVariable String codigo,
                                                         @Valid @RequestBody AjusteStockRequest request){
        return ResponseEntity.ok(productoService.ajustarStock(codigo, request.getCantidadCambio()));
    }

    @Hidden
    @PutMapping("/interno/productos/{codigo}/stock")
    public ResponseEntity<ProductoResponse> descontarStockPorVenta(
            @PathVariable String codigo,
            @Valid @RequestBody DescuentoStockRequest request){
        return ResponseEntity.ok(productoService.ajustarStock(codigo, request.cantidadCambio()));
    }

    @SecurityRequirement(name = "bearerAuth")
    @DeleteMapping("/productos/{codigo}")
    public ResponseEntity<Void> eliminar(@PathVariable String codigo){
        productoService.eliminar(codigo);
        return ResponseEntity.noContent().build();
    }
}
