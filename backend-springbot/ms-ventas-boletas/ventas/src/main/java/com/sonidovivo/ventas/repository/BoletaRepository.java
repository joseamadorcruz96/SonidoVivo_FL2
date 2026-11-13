package com.sonidovivo.ventas.repository;

import com.sonidovivo.ventas.model.Boleta;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BoletaRepository extends JpaRepository<Boleta, Long> {
    List<Boleta> findAllByOrderByFechaDesc();

    List<Boleta> findAllByUsuarioIdOrderByFechaDesc(Long usuarioId);
}
