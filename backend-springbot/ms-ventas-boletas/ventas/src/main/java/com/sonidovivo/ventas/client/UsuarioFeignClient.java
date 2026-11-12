package com.sonidovivo.ventas.client;

import com.sonidovivo.ventas.client.dto.UsuarioRemotoResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "ms-usuarios-auth", url = "${ms.usuarios.url}")
public interface UsuarioFeignClient {

    @GetMapping("/api/v1/usuarios/{id}")
    UsuarioRemotoResponse obtenerUsuarioPorId(@PathVariable("id") Long id);
}
