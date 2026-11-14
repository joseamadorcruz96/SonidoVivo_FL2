package com.sonidovivo.inventario.controller;

import com.sonidovivo.inventario.dto.AjusteStockRequest;
import com.sonidovivo.inventario.dto.DescuentoStockRequest;
import com.sonidovivo.inventario.dto.ProductoActualizacionRequest;
import com.sonidovivo.inventario.dto.ProductoRequest;
import com.sonidovivo.inventario.dto.ProductoResponse;
import com.sonidovivo.inventario.service.ProductoService;
import io.swagger.v3.oas.annotations.Hidden;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
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

@Tag(name = "Productos", description = "Consulta y administración del catálogo y del stock.")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1")
public class ProductoController {

    private final ProductoService productoService;

    @Operation(summary = "Listar productos", description = "Consulta pública. Devuelve los productos con su categoría y stock.")
    @ApiResponse(responseCode = "200", description = "Listado de productos", useReturnTypeSchema = true)
    @GetMapping("/productos")
    public ResponseEntity<List<ProductoResponse>> listar(){
        return ResponseEntity.ok(productoService.listar());
    }

    @Operation(summary = "Consultar producto por código", description = "Consulta pública por código de producto (SKU).")
    @ApiResponse(responseCode = "200", description = "Producto encontrado", useReturnTypeSchema = true)
    @ApiResponse(responseCode = "404", description = "El código no existe", content = @Content)
    @GetMapping("/productos/codigo/{codigo}")
    public ResponseEntity<ProductoResponse> buscarPorCodigo(@PathVariable String codigo){
        return ResponseEntity.ok(productoService.buscarPorCodigo(codigo));
    }

    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Crear producto", description = "Solo ADMIN. Registra un producto con stock inicial en una categoría existente.")
    @ApiResponse(responseCode = "201", description = "Producto creado", useReturnTypeSchema = true)
    @ApiResponse(responseCode = "400", description = "Datos inválidos", content = @Content)
    @ApiResponse(responseCode = "404", description = "Categoría inexistente", content = @Content)
    @ApiResponse(responseCode = "409", description = "El código ya está registrado", content = @Content)
    @PostMapping("/productos")
    public ResponseEntity<ProductoResponse> crear(@Valid @RequestBody ProductoRequest request){
        return ResponseEntity.status(HttpStatus.CREATED).body(productoService.crear(request));
    }

    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Actualizar producto", description = "Solo ADMIN. Actualiza los datos del producto identificado por su código.")
    @ApiResponse(responseCode = "200", description = "Producto actualizado", useReturnTypeSchema = true)
    @ApiResponse(responseCode = "400", description = "Datos inválidos", content = @Content)
    @ApiResponse(responseCode = "404", description = "Producto o categoría inexistente", content = @Content)
    @PutMapping("/productos/{codigo}")
    public ResponseEntity<ProductoResponse> actualizar(@PathVariable String codigo,
                                                       @Valid @RequestBody ProductoActualizacionRequest request){
        return ResponseEntity.ok(productoService.actualizar(codigo, request));
    }

    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Ajustar stock", description = "ADMIN y VENDEDOR. Una cantidad positiva suma unidades y una negativa las descuenta.")
    @ApiResponse(responseCode = "200", description = "Stock actualizado", useReturnTypeSchema = true)
    @ApiResponse(responseCode = "400", description = "Cantidad de ajuste ausente o inválida", content = @Content)
    @ApiResponse(responseCode = "404", description = "Producto inexistente", content = @Content)
    @ApiResponse(responseCode = "409", description = "Stock insuficiente o superior al máximo permitido", content = @Content)
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
    @Operation(summary = "Eliminar producto", description = "Solo ADMIN. El producto debe tener stock igual a cero.")
    @ApiResponse(responseCode = "204", description = "Producto eliminado", content = @Content)
    @ApiResponse(responseCode = "404", description = "Producto inexistente", content = @Content)
    @ApiResponse(responseCode = "409", description = "El producto todavía tiene stock", content = @Content)
    @DeleteMapping("/productos/{codigo}")
    public ResponseEntity<Void> eliminar(@PathVariable String codigo){
        productoService.eliminar(codigo);
        return ResponseEntity.noContent().build();
    }
}
