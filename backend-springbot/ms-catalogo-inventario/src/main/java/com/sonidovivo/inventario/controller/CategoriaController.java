package com.sonidovivo.inventario.controller;

import com.sonidovivo.inventario.dto.CategoriaRequest;
import com.sonidovivo.inventario.dto.CategoriaResponse;
import com.sonidovivo.inventario.service.CategoriaService;
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
@RequestMapping("/api/v1/categorias")
public class CategoriaController {

    private final CategoriaService categoriaService;

    @GetMapping()
    public ResponseEntity<List<CategoriaResponse>> listar(){
        return ResponseEntity.ok(categoriaService.listar());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CategoriaResponse> buscarPorId(@PathVariable Long id){
        return ResponseEntity.ok(categoriaService.buscarPorId(id));
    }

    @SecurityRequirement(name = "bearerAuth")
    @PostMapping
    public ResponseEntity<CategoriaResponse> crear(@Valid @RequestBody CategoriaRequest request){
        return ResponseEntity.status(HttpStatus.CREATED).body(categoriaService.crear(request));
    }

    @SecurityRequirement(name = "bearerAuth")
    @PutMapping("/{id}")
    public ResponseEntity<CategoriaResponse> actualizar(@PathVariable Long id, @Valid @RequestBody CategoriaRequest request){
        return ResponseEntity.ok(categoriaService.actualizar(id, request));
    }

    @SecurityRequirement(name = "bearerAuth")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id){
        categoriaService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
