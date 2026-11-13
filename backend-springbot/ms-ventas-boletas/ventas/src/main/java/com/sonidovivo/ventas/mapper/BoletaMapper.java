package com.sonidovivo.ventas.mapper;

import com.sonidovivo.ventas.dto.BoletaResponse;
import com.sonidovivo.ventas.model.Boleta;
import com.sonidovivo.ventas.model.DetalleBoleta;
import org.springframework.stereotype.Component;

@Component
public class BoletaMapper {

    public BoletaResponse toResponse(Boleta boleta) {
        var cliente = new BoletaResponse.ClienteResponse(
                boleta.getClienteNombre(),
                boleta.getClienteApellidos(),
                boleta.getClienteEmail()
        );
        var direccion = new BoletaResponse.DireccionResponse(
                boleta.getCalle(),
                boleta.getDepartamento(),
                boleta.getRegion(),
                boleta.getComuna(),
                boleta.getIndicaciones()
        );
        var items = boleta.getItems().stream()
                .map(this::toItemResponse)
                .toList();

        return new BoletaResponse(
                boleta.getId(),
                boleta.getNumeroOrden(),
                boleta.getCodigoOrden(),
                boleta.getFecha(),
                boleta.getUsuarioId(),
                cliente,
                direccion,
                items,
                boleta.getTotal(),
                boleta.getEstado()
        );
    }

    private BoletaResponse.ItemResponse toItemResponse(DetalleBoleta detalle) {
        return new BoletaResponse.ItemResponse(
                detalle.getProductoCodigo(),
                detalle.getNombre(),
                detalle.getPrecio(),
                detalle.getCantidad(),
                detalle.getImagen()
        );
    }
}
