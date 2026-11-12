package com.sonidovivo.ventas.dto;

import java.time.LocalDateTime;
import java.util.List;

/** Representación de boleta para el comprobante y las vistas administrativas. */
public record BoletaResponse(
        Long id,
        String numeroOrden,
        String codigoOrden,
        LocalDateTime fecha,
        Long usuarioId,
        ClienteResponse cliente,
        DireccionResponse direccion,
        List<ItemResponse> items,
        Integer total,
        String estado
) {

    public record ClienteResponse(String nombre, String apellidos, String email) {
    }

    public record DireccionResponse(
            String calle,
            String departamento,
            String region,
            String comuna,
            String indicaciones
    ) {
    }

    public record ItemResponse(
            String codigo,
            String nombre,
            Integer precio,
            Integer cantidad,
            String imagen
    ) {
    }
}
