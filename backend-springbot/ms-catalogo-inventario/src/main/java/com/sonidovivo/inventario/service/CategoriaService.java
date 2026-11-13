package com.sonidovivo.inventario.service;

import com.sonidovivo.inventario.dto.CategoriaRequest;
import com.sonidovivo.inventario.dto.CategoriaResponse;
import com.sonidovivo.inventario.exception.ResourceAlreadyExistsException;
import com.sonidovivo.inventario.exception.ResourceConflictException;
import com.sonidovivo.inventario.exception.ResourceNotFoundException;
import com.sonidovivo.inventario.mapper.CategoriaMapper;
import com.sonidovivo.inventario.model.Categoria;
import com.sonidovivo.inventario.repository.CategoriaRepository;
import com.sonidovivo.inventario.repository.ProductoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class CategoriaService {

    private final CategoriaRepository categoriaRepository;
    private final ProductoRepository productoRepository;
    private final CategoriaMapper categoriaMapper;

    @Transactional(readOnly = true)
    public List<CategoriaResponse> listar(){
        return categoriaRepository.findAll().stream()
                .map(categoriaMapper::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public CategoriaResponse buscarPorId(Long id){
        return categoriaMapper.toResponse(obtenerCategoria(id));
    }

    public CategoriaResponse crear(CategoriaRequest request){
        if (categoriaRepository.existsByNombre(request.getNombre())){
            throw new ResourceAlreadyExistsException("Ya existe una categoria " + request.getNombre());
        }
        return categoriaMapper.toResponse(categoriaRepository.save(categoriaMapper.toEntity(request)));
    }

    public CategoriaResponse actualizar(Long id, CategoriaRequest request){
        Categoria categoria = obtenerCategoria(id);
        if (categoriaRepository.existsByNombreAndIdNot(request.getNombre(), id)){
            throw new ResourceAlreadyExistsException("Ya existe una categoria " + request.getNombre());
        }
        categoria.setNombre(request.getNombre());
        categoria.setDescripcion(request.getDescripcion());
        return categoriaMapper.toResponse(categoriaRepository.save(categoria));
    }

    public void eliminar(Long id){
        Categoria categoria = obtenerCategoria(id);
        if (productoRepository.existsByCategoria_Id(id)){
            throw new ResourceConflictException("La categoría tiene productos asociados");
        }
        categoriaRepository.delete(categoria);
    }

    private Categoria obtenerCategoria(Long id){
        return categoriaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Categoria no encontrada por ID"));
    }

}
