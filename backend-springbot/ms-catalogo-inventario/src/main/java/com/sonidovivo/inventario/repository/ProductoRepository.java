package com.sonidovivo.inventario.repository;

import com.sonidovivo.inventario.model.Producto;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ProductoRepository extends JpaRepository<Producto, Long> {
    @Override
    @EntityGraph(attributePaths = "categoria")
    List<Producto> findAll();

    @EntityGraph(attributePaths = "categoria")
    Optional<Producto> findByCodigo(String codigo);
    boolean existsByCodigo(String codigo);
    boolean existsByCategoria_Id(Long categoriaId);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select p from Producto p where p.codigo = :codigo")
    Optional<Producto> buscarPorCodigoParaEscritura(@Param("codigo") String codigo);
}
