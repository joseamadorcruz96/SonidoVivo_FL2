package com.sonidovivo.inventario.controller;

import com.sonidovivo.inventario.dto.CategoriaRequest;
import com.sonidovivo.inventario.dto.CategoriaResponse;
import com.sonidovivo.inventario.service.CategoriaService;
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

@Tag(name = "Categorías", description = "Consulta y administración de las categorías de instrumentos.")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/categorias")
public class CategoriaController {

    private final CategoriaService categoriaService;

    @Operation(summary = "Listar categorías", description = "Consulta pública de las categorías del catálogo.")
    @ApiResponse(responseCode = "200", description = "Listado de categorías", useReturnTypeSchema = true)
    @GetMapping()
    public ResponseEntity<List<CategoriaResponse>> listar(){
        return ResponseEntity.ok(categoriaService.listar());
    }

    @Operation(summary = "Consultar categoría por ID", description = "Consulta pública de una categoría por su identificador.")
    @ApiResponse(responseCode = "200", description = "Categoría encontrada", useReturnTypeSchema = true)
    @ApiResponse(responseCode = "404", description = "Categoría inexistente", content = @Content)
    @GetMapping("/{id}")
    public ResponseEntity<CategoriaResponse> buscarPorId(@PathVariable Long id){
        return ResponseEntity.ok(categoriaService.buscarPorId(id));
    }

    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Crear categoría", description = "Solo ADMIN. Registra una categoría con nombre único.")
    @ApiResponse(responseCode = "201", description = "Categoría creada", useReturnTypeSchema = true)
    @ApiResponse(responseCode = "400", description = "Datos inválidos", content = @Content)
    @ApiResponse(responseCode = "409", description = "El nombre ya está registrado", content = @Content)
    @PostMapping
    public ResponseEntity<CategoriaResponse> crear(@Valid @RequestBody CategoriaRequest request){
        return ResponseEntity.status(HttpStatus.CREATED).body(categoriaService.crear(request));
    }

    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Actualizar categoría", description = "Solo ADMIN. Modifica el nombre y la descripción de una categoría.")
    @ApiResponse(responseCode = "200", description = "Categoría actualizada", useReturnTypeSchema = true)
    @ApiResponse(responseCode = "400", description = "Datos inválidos", content = @Content)
    @ApiResponse(responseCode = "404", description = "Categoría inexistente", content = @Content)
    @ApiResponse(responseCode = "409", description = "El nombre ya está registrado", content = @Content)
    @PutMapping("/{id}")
    public ResponseEntity<CategoriaResponse> actualizar(@PathVariable Long id, @Valid @RequestBody CategoriaRequest request){
        return ResponseEntity.ok(categoriaService.actualizar(id, request));
    }

    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Eliminar categoría", description = "Solo ADMIN. La categoría debe estar libre de productos asociados.")
    @ApiResponse(responseCode = "204", description = "Categoría eliminada", content = @Content)
    @ApiResponse(responseCode = "404", description = "Categoría inexistente", content = @Content)
    @ApiResponse(responseCode = "409", description = "La categoría tiene productos asociados", content = @Content)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id){
        categoriaService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
