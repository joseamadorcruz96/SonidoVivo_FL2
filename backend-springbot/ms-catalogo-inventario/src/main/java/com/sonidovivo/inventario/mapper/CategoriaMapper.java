package com.sonidovivo.inventario.mapper;

import com.sonidovivo.inventario.dto.CategoriaRequest;
import com.sonidovivo.inventario.dto.CategoriaResponse;
import com.sonidovivo.inventario.model.Categoria;
import org.springframework.stereotype.Component;

@Component
public class CategoriaMapper {

    public CategoriaResponse toResponse(Categoria categoria){
        return new CategoriaResponse(
                categoria.getId(),
                categoria.getNombre(),
                categoria.getDescripcion()
        );
    }

    public Categoria toEntity(CategoriaRequest request){
        Categoria categoria = new Categoria();
        categoria.setNombre(request.getNombre());
        categoria.setDescripcion(request.getDescripcion());
        return categoria;
    }
}
