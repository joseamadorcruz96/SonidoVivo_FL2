package com.sonidovivo.inventario.service;

import com.sonidovivo.inventario.dto.ProductoActualizacionRequest;
import com.sonidovivo.inventario.dto.ProductoRequest;
import com.sonidovivo.inventario.dto.ProductoResponse;
import com.sonidovivo.inventario.exception.ResourceAlreadyExistsException;
import com.sonidovivo.inventario.exception.ResourceConflictException;
import com.sonidovivo.inventario.exception.ResourceNotFoundException;
import com.sonidovivo.inventario.mapper.ProductoMapper;
import com.sonidovivo.inventario.model.Categoria;
import com.sonidovivo.inventario.model.Producto;
import com.sonidovivo.inventario.repository.CategoriaRepository;
import com.sonidovivo.inventario.repository.ProductoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class ProductoService {

    private final ProductoRepository productoRepository;
    private final CategoriaRepository categoriaRepository;
    private final ProductoMapper productoMapper;

    @Transactional(readOnly = true)
    public List<ProductoResponse> listar(){
        return productoRepository.findAll().stream()
                .map(productoMapper::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public ProductoResponse buscarPorCodigo(String codigo){
        return productoRepository.findByCodigo(codigo)
                .map(productoMapper::toResponse)
                .orElseThrow(() -> new ResourceNotFoundException("Producto no encontrado por código " + codigo));
    }

    public ProductoResponse crear(ProductoRequest request){
        if (productoRepository.existsByCodigo(request.getCodigo())){
            throw new ResourceAlreadyExistsException("Ya existe un producto con código " + request.getCodigo());
        }
        Categoria categoria = obtenerCategoria(request.getCategoriaId());
        return productoMapper.toResponse(productoRepository.save(productoMapper.toEntity(request, categoria)));
    }

    public ProductoResponse actualizar(String codigo, ProductoActualizacionRequest request){
        Producto producto = obtenerProductoParaEscritura(codigo);
        Categoria categoria = obtenerCategoria(request.getCategoriaId());

        producto.setNombre(request.getNombre());
        producto.setMarca(request.getMarca());
        producto.setModelo(request.getModelo());
        producto.setPrecio(request.getPrecio());
        producto.setStockCritico(request.getStockCritico());
        producto.setDescripcion(request.getDescripcion());
        producto.setImagen(request.getImagen());
        producto.setDestacado(request.isDestacado());
        producto.setCategoria(categoria);

        return productoMapper.toResponse(productoRepository.save(producto));
    }

    public ProductoResponse ajustarStock(String codigo, Integer cantidadCambio){
        Producto producto = obtenerProductoParaEscritura(codigo);
        long nuevoStock = (long) producto.getStock() + cantidadCambio;
        if (nuevoStock < 0){
            throw new ResourceConflictException("Stock insuficiente para el producto " + codigo);
        }
        if (nuevoStock > Integer.MAX_VALUE){
            throw new ResourceConflictException("El ajuste supera el stock máximo permitido");
        }
        producto.setStock((int) nuevoStock);
        return productoMapper.toResponse(productoRepository.save(producto));
    }

    public void eliminar(String codigo){
        Producto producto = obtenerProductoParaEscritura(codigo);
        if (producto.getStock() != 0){
            throw new ResourceConflictException("El producto tiene stock y no se puede eliminar");
        }
        productoRepository.delete(producto);
    }

    private Producto obtenerProductoParaEscritura(String codigo){
        return productoRepository.buscarPorCodigoParaEscritura(codigo)
                .orElseThrow(() -> new ResourceNotFoundException("Producto no encontrado por código " + codigo));
    }

    private Categoria obtenerCategoria(Long categoriaId){
        return categoriaRepository.findById(categoriaId)
                .orElseThrow(() -> new ResourceNotFoundException("Categoría no encontrada por ID " + categoriaId));
    }
}
