package com.sonidovivo.ventas.client;

import com.sonidovivo.ventas.client.dto.AjusteStockRequest;
import com.sonidovivo.ventas.client.dto.ProductoInventarioResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "ms-catalogo-inventario", url = "${ms.inventario.url}")
public interface InventarioFeignClient {

    @GetMapping("/api/v1/productos/codigo/{codigo}")
    ProductoInventarioResponse obtenerProductoPorCodigo(@PathVariable("codigo") String codigo);

    @PutMapping("/api/v1/productos/{codigo}/stock")
    ProductoInventarioResponse ajustarStock(
            @PathVariable("codigo") String codigo,
            @RequestBody AjusteStockRequest request
    );
}
