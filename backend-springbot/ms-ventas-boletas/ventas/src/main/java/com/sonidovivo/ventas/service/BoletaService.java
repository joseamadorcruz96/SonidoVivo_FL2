package com.sonidovivo.ventas.service;

import com.sonidovivo.ventas.client.InventarioFeignClient;
import com.sonidovivo.ventas.client.UsuarioFeignClient;
import com.sonidovivo.ventas.client.dto.AjusteStockRequest;
import com.sonidovivo.ventas.client.dto.ProductoInventarioResponse;
import com.sonidovivo.ventas.dto.BoletaResponse;
import com.sonidovivo.ventas.dto.CrearBoletaRequest;
import com.sonidovivo.ventas.mapper.BoletaMapper;
import com.sonidovivo.ventas.model.Boleta;
import com.sonidovivo.ventas.model.DetalleBoleta;
import com.sonidovivo.ventas.repository.BoletaRepository;
import feign.FeignException;
import org.springframework.http.HttpStatus;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class BoletaService {

    private final BoletaRepository boletaRepository;
    private final InventarioFeignClient inventarioFeignClient;
    private final UsuarioFeignClient usuarioFeignClient;
    private final BoletaMapper boletaMapper;

    @Value("${ms.inventario.ventas-key:}")
    private String ventasServiceKey;

    public BoletaService(
            BoletaRepository boletaRepository,
            InventarioFeignClient inventarioFeignClient,
            UsuarioFeignClient usuarioFeignClient,
            BoletaMapper boletaMapper
    ) {
        this.boletaRepository = boletaRepository;
        this.inventarioFeignClient = inventarioFeignClient;
        this.usuarioFeignClient = usuarioFeignClient;
        this.boletaMapper = boletaMapper;
    }

    @Transactional
    public BoletaResponse crear(CrearBoletaRequest request) {
        Long usuarioId = resolverUsuarioId(request.usuarioId());
        if (usuarioId != null) {
            llamarServicio(() -> usuarioFeignClient.obtenerUsuarioPorId(usuarioId));
        }

        Map<String, Integer> cantidadesPorCodigo = agruparCantidades(request.items());
        List<ItemValidado> itemsValidados = new ArrayList<>();
        long total = 0;

        // Verifica todos los productos y precios antes de iniciar descuentos de stock.
        for (Map.Entry<String, Integer> entrada : cantidadesPorCodigo.entrySet()) {
            ProductoInventarioResponse producto = llamarServicio(
                    () -> inventarioFeignClient.obtenerProductoPorCodigo(entrada.getKey())
            );
            int cantidad = entrada.getValue();

            if (producto.precio() == null || producto.precio() < 0 || producto.stock() == null) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_GATEWAY,
                        "El catálogo devolvió datos incompletos para " + entrada.getKey()
                );
            }
            if (producto.stock() < cantidad) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "Stock insuficiente para el producto " + entrada.getKey()
                );
            }

            try {
                total = Math.addExact(total, Math.multiplyExact((long) producto.precio(), cantidad));
            } catch (ArithmeticException ex) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El total de la compra es demasiado grande");
            }
            itemsValidados.add(new ItemValidado(producto, cantidad));
        }

        if (total > Integer.MAX_VALUE) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El total de la compra supera el máximo permitido");
        }
        validarClaveServicioVentas();

        Boleta boleta = crearEntidad(request, usuarioId, itemsValidados, (int) total);
        List<ItemValidado> stockDescontado = new ArrayList<>();
        try {
            for (ItemValidado item : itemsValidados) {
                llamarServicio(() -> inventarioFeignClient.ajustarStock(
                        item.producto().codigo(),
                        new AjusteStockRequest(-item.cantidad()),
                        ventasServiceKey
                ));
                stockDescontado.add(item);
            }

            return boletaMapper.toResponse(boletaRepository.save(boleta));
        } catch (RuntimeException ex) {
            revertirDescuentos(stockDescontado, ex);
            throw ex;
        }
    }

    @Transactional(readOnly = true)
    public List<BoletaResponse> listar() {
        return boletaRepository.findAllByOrderByFechaDesc().stream()
                .map(boletaMapper::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public BoletaResponse buscarPorId(Long id) {
        Boleta boleta = boletaRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Boleta no encontrada"));
        verificarAccesoCliente(boleta.getUsuarioId());
        return boletaMapper.toResponse(boleta);
    }

    @Transactional(readOnly = true)
    public List<BoletaResponse> listarPorUsuario(Long usuarioId) {
        Authentication authentication = obtenerAutenticacion();
        if (!authentication.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_ADMIN"))) {
            if (!authentication.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_CLIENTE"))) {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, "No tienes permiso para ver este historial");
            }
            if (!usuarioId.equals(obtenerUsuarioAutenticadoId(authentication))) {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Solo puedes consultar tu propio historial");
            }
        }
        return boletaRepository.findAllByUsuarioIdOrderByFechaDesc(usuarioId).stream()
                .map(boletaMapper::toResponse)
                .toList();
    }

    private Boleta crearEntidad(
            CrearBoletaRequest request,
            Long usuarioId,
            List<ItemValidado> itemsValidados,
            int total
    ) {
        Boleta boleta = new Boleta();
        boleta.setNumeroOrden("#" + (10000000 + (int) (Math.random() * 90000000)));
        boleta.setCodigoOrden("ORDER-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        boleta.setUsuarioId(usuarioId);
        boleta.setClienteNombre(request.cliente().nombre().trim());
        boleta.setClienteApellidos(request.cliente().apellidos().trim());
        boleta.setClienteEmail(request.cliente().email().trim());
        boleta.setCalle(request.direccion().calle().trim());
        boleta.setDepartamento(limpiarOpcional(request.direccion().departamento()));
        boleta.setRegion(request.direccion().region());
        boleta.setComuna(request.direccion().comuna());
        boleta.setIndicaciones(limpiarOpcional(request.direccion().indicaciones()));
        boleta.setTotal(total);
        boleta.setEstado("completada");

        for (ItemValidado item : itemsValidados) {
            DetalleBoleta detalle = new DetalleBoleta();
            detalle.setProductoCodigo(item.producto().codigo());
            detalle.setNombre(item.producto().nombre());
            detalle.setPrecio(item.producto().precio());
            detalle.setCantidad(item.cantidad());
            detalle.setImagen(item.producto().imagen());
            boleta.agregarDetalle(detalle);
        }
        return boleta;
    }

    private Map<String, Integer> agruparCantidades(List<CrearBoletaRequest.ItemRequest> items) {
        Map<String, Integer> cantidades = new LinkedHashMap<>();
        for (CrearBoletaRequest.ItemRequest item : items) {
            try {
                cantidades.merge(item.codigo().trim(), item.cantidad(), Math::addExact);
            } catch (ArithmeticException ex) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cantidad de producto demasiado grande");
            }
        }
        return cantidades;
    }

    private Long resolverUsuarioId(Long usuarioIdSolicitado) {
        Authentication authentication = obtenerAutenticacionSiExiste();
        if (authentication == null) {
            if (usuarioIdSolicitado != null) {
                throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Debes iniciar sesión para asociar una boleta a un usuario");
            }
            return null;
        }

        if (authentication.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_CLIENTE"))) {
            Long idAutenticado = obtenerUsuarioAutenticadoId(authentication);
            if (usuarioIdSolicitado != null && !usuarioIdSolicitado.equals(idAutenticado)) {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, "No puedes crear una boleta para otro usuario");
            }
            return idAutenticado;
        }
        return usuarioIdSolicitado;
    }

    private void verificarAccesoCliente(Long usuarioIdBoleta) {
        Authentication authentication = obtenerAutenticacion();
        if (authentication.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_CLIENTE"))
                && (usuarioIdBoleta == null || !usuarioIdBoleta.equals(obtenerUsuarioAutenticadoId(authentication)))) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Solo puedes consultar tus propias boletas");
        }
    }

    private Authentication obtenerAutenticacion() {
        Authentication authentication = obtenerAutenticacionSiExiste();
        if (authentication == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Debes iniciar sesión");
        }
        return authentication;
    }

    private Authentication obtenerAutenticacionSiExiste() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()
                || authentication instanceof AnonymousAuthenticationToken) {
            return null;
        }
        return authentication;
    }

    private Long obtenerUsuarioAutenticadoId(Authentication authentication) {
        if (authentication.getDetails() instanceof Number id) {
            return id.longValue();
        }
        throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "El token no incluye un ID de usuario válido");
    }

    private void revertirDescuentos(List<ItemValidado> descontados, RuntimeException causa) {
        for (int index = descontados.size() - 1; index >= 0; index--) {
            ItemValidado item = descontados.get(index);
            try {
                inventarioFeignClient.ajustarStock(
                        item.producto().codigo(),
                        new AjusteStockRequest(item.cantidad()),
                        ventasServiceKey
                );
            } catch (RuntimeException errorReversion) {
                causa.addSuppressed(errorReversion);
            }
        }
    }

    private void validarClaveServicioVentas() {
        if (ventasServiceKey == null || ventasServiceKey.isBlank()) {
            throw new ResponseStatusException(
                    HttpStatus.SERVICE_UNAVAILABLE,
                    "Configura VENTAS_SERVICE_KEY para descontar stock"
            );
        }
    }

    private <T> T llamarServicio(OperacionRemota<T> operacion) {
        try {
            return operacion.ejecutar();
        } catch (FeignException.NotFound ex) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "No se encontró el producto o usuario solicitado", ex);
        } catch (FeignException.BadRequest | FeignException.Conflict ex) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El servicio remoto rechazó la operación", ex);
        }
    }

    private String limpiarOpcional(String valor) {
        return valor == null || valor.isBlank() ? null : valor.trim();
    }

    @FunctionalInterface
    private interface OperacionRemota<T> {
        T ejecutar();
    }

    private record ItemValidado(ProductoInventarioResponse producto, int cantidad) {
    }
}
