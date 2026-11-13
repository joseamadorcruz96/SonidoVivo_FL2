package com.sonidovivo.inventario.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProductoResponse {
    private Long id;
    private String codigo;
    private String nombre;
    private String marca;
    private String modelo;
    private Integer precio;
    private Integer stock;
    private Integer stockCritico;
    private String descripcion;
    private String imagen;
    private boolean destacado;
    private Long categoriaId;
    private String categoria;
}
