package com.sonidovivo.inventario.mapper;

import com.sonidovivo.inventario.dto.ProductoRequest;
import com.sonidovivo.inventario.dto.ProductoResponse;
import com.sonidovivo.inventario.model.Categoria;
import com.sonidovivo.inventario.model.Producto;
import org.springframework.stereotype.Component;

@Component
public class ProductoMapper {

    public ProductoResponse toResponse(Producto producto) {
        Categoria categoria = producto.getCategoria();
        ProductoResponse response = new ProductoResponse();
        response.setId(producto.getId());
        response.setCodigo(producto.getCodigo());
        response.setNombre(producto.getNombre());
        response.setMarca(producto.getMarca());
        response.setModelo(producto.getModelo());
        response.setPrecio(producto.getPrecio());
        response.setStock(producto.getStock());
        response.setStockCritico(producto.getStockCritico());
        response.setDescripcion(producto.getDescripcion());
        response.setImagen(producto.getImagen());
        response.setDestacado(producto.isDestacado());
        response.setCategoriaId(categoria.getId());
        response.setCategoria(categoria.getNombre());
        return response;
    }

    public Producto toEntity(ProductoRequest request, Categoria categoria) {
        Producto producto = new Producto();
        producto.setCodigo(request.getCodigo());
        producto.setNombre(request.getNombre());
        producto.setMarca(request.getMarca());
        producto.setModelo(request.getModelo());
        producto.setPrecio(request.getPrecio());
        producto.setStock(request.getStock());
        producto.setStockCritico(request.getStockCritico());
        producto.setDescripcion(request.getDescripcion());
        producto.setImagen(request.getImagen());
        producto.setDestacado(request.isDestacado());
        producto.setCategoria(categoria);
        return producto;
    }
}
