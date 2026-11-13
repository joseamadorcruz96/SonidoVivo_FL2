# 🎸 Backend Microservicios — Sonido Vivo (`DSY1104` - Evaluación Parcial 3)

Repositorio backend **Maven Multi-Módulo** desarrollado con **Spring Boot 3.4.3** y **Spring Cloud 2024.0.0** para el e-commerce de instrumentos musicales **Sonido Vivo**.

---

## 🏛️ Arquitectura del Sistema

El backend está diseñado bajo una arquitectura de **3 Microservicios de Dominio + 1 API Gateway**, con comunicación inter-servicio **síncrona/bloqueante mediante Spring Cloud OpenFeign**, seguridad basada en **Spring Security + JWT (JSON Web Tokens)** y documentación interactiva **Swagger OpenAPI centralizada**.

| Módulo / Carpeta | Puerto | Tablas en Base de Datos | Especificación Técnica Detallada |
| :--- | :---: | :--- | :--- |
| 📁 [`api-gateway`](./api-gateway/README.md) | `8080` | *Ninguna (Enrutador)* | [Ver README de `api-gateway`](./api-gateway/README.md) |
| 📁 [`ms-usuarios-auth`](./ms-usuarios-auth/README.md) | `8081` | `usuarios` (+ `Enum Rol`) | [Ver README de `ms-usuarios-auth`](./ms-usuarios-auth/README.md) |
| 📁 [`ms-catalogo-inventario`](./ms-catalogo-inventario/README.md) | `8082` | `categorias`, `productos` | [Ver README de `ms-catalogo-inventario`](./ms-catalogo-inventario/README.md) |
| 📁 [`ms-ventas-boletas`](./ms-ventas-boletas/README.md) | `8083` | `boletas`, `detalle_boletas` | [Ver README de `ms-ventas-boletas`](./ms-ventas-boletas/README.md) |

---

## 📚 Documentación y Curso Pedagógico

* [Temario Maestro y Contrato Técnico](./Curso/TEMARIO.md)
* [Bitácora de Progreso](./Curso/BITACORA_PROGRESO.md)
* [Prompt y Guía para Compañeros de Equipo](./Documentacion/PROMPT_EQUIPO_CURSO_MICROSERVICIOS.md)
* [Instrucciones Oficiales EP3 - Anexo 1](./Documentacion/DSY1104%20Evaluaci%C3%B3n%20Parcial%203%20-%20Anexo%201%20Instrucciones.md)
* [Pauta y Rúbrica de Evaluación EP3](./Documentacion/DSY1104%20Evaluaci%C3%B3n%20Parcial%203_EE_EP_Estudiante.md)

---

## 🔐 Guía de Integración de Seguridad JWT y OpenFeign (`ms-catalogo-inventario` y `ms-ventas-boletas`)

> **Principio clave (*Stateless*):** **`ms-usuarios-auth` (`8081`) es el único microservicio que emite tokens JWT** (login, registro, `BCrypt`, tabla `USUARIO`). Los microservicios **`ms-catalogo-inventario` (`8082`)** y **`ms-ventas-boletas` (`8083`)** **NO deben consultar a `8081` para validar seguridad**: verifican la firma del JWT localmente usando el mismo `jwt.secret`.

### A. Pasos para Integrar Seguridad en `ms-catalogo-inventario` (Puerto `8082`)

1. **`application.properties` (`ms-catalogo-inventario/src/main/resources/application.properties`):**
   - Configurar `server.port=8082` e inyectar `jwt.secret=${JWT_SECRET}` desde variable de entorno o archivo `.env` local (copiar [`.env.example`](./.env.example) como `.env`, nunca subir secretos reales al repo):
     ```properties
     server.port=8082
     jwt.secret=${JWT_SECRET}
     ```
2. **Dependencias en `ms-catalogo-inventario/pom.xml`:**
   - Agregar `spring-boot-starter-security` y la librería `jjwt` versión `0.11.5` (`jjwt-api`, `jjwt-impl` con `<scope>runtime</scope>`, `jjwt-jackson` con `<scope>runtime</scope>`), tal como en [`usuarios/pom.xml`](./ms-usuarios-auth/usuarios/pom.xml).
3. **`JwtUtil` liviano (solo lectura y verificación):**
   - Copiar de [`JwtUtil.java`](./ms-usuarios-auth/usuarios/src/main/java/com/sonidovivo/usuarios/security/JwtUtil.java) únicamente `obtenerLlaveFirma()`, `esTokenValido(String token)`, `extraerCorreo(String token)` y `extraerRol(String token)` (leyendo el claim `"rol"`, donde vienen `"ADMIN"`, `"VENDEDOR"` o `"CLIENTE"`). **No necesita `generarToken`**.
4. **`JwtAuthenticationFilter` (`OncePerRequestFilter`):**
   - Copiar [`JwtAuthenticationFilter.java`](./ms-usuarios-auth/usuarios/src/main/java/com/sonidovivo/usuarios/security/JwtAuthenticationFilter.java) para leer `Authorization: Bearer <token>`, validar el JWT con `JwtUtil`, anteponer `"ROLE_"` en `SimpleGrantedAuthority` y poblar el `SecurityContextHolder`.
5. **`SecurityConfig` propio de Inventario (`SecurityFilterChain` + `CorsConfigurationSource`):**
   - Desactivar CSRF (`csrf.disable()`), fijar `SessionCreationPolicy.STATELESS`, habilitar CORS para React (`http://localhost:5173`, `http://127.0.0.1:5173`) con headers `Authorization` y `Content-Type`, y definir sus reglas de ruta:
     - **Públicas (`permitAll()`):** `GET /api/v1/productos/**`, `GET /api/v1/categorias/**`, `/swagger-ui/**`, `/swagger-ui.html`, `/v3/api-docs/**`.
     - **Protegidas por rol:** `POST`, `PUT`, `DELETE` de `/api/v1/productos/**` y `/api/v1/categorias/**` con `.hasRole("ADMIN")` (y ajuste/stock con `.hasAnyRole("ADMIN", "VENDEDOR")` si lo opera el vendedor).
     - **Nota importante para OpenFeign desde Ventas:** [`InventarioFeignClient.java`](./ms-ventas-boletas/ventas/src/main/java/com/sonidovivo/ventas/client/InventarioFeignClient.java) invoca `GET /api/v1/productos/codigo/{codigo}` y `PUT /api/v1/productos/{codigo}/stock` (endpoint pendiente de exponer en [`ProductoController.java`](./ms-catalogo-inventario/src/main/java/com/sonidovivo/inventario/controller/ProductoController.java)). Si `ms-ventas-boletas` no propaga el header `Authorization` al llamar por Feign, dejar `PUT /api/v1/productos/{codigo}/stock` accesible internamente o habilitar propagación JWT en Ventas.

---

### B. Pasos para Integrar Seguridad y OpenFeign en `ms-ventas-boletas` (Puerto `8083`)

1. **`application.properties` (`ms-ventas-boletas/ventas/src/main/resources/application.properties`):**
   - Usar la **misma variable de entorno `${JWT_SECRET}`** que usan `ms-usuarios-auth` y `ms-catalogo-inventario`:
     ```properties
     jwt.secret=${JWT_SECRET}
     ```
2. **Dependencias en `ms-ventas-boletas/ventas/pom.xml`:**
   - Ya cuenta con `spring-boot-starter-security` y `spring-cloud-starter-openfeign`; solo falta agregar los 3 artefactos de `jjwt` versión `0.11.5` (`jjwt-api`, `jjwt-impl`, `jjwt-jackson`).
3. **`JwtUtil` (solo lectura/validación) + `JwtAuthenticationFilter` (`OncePerRequestFilter`):**
   - Replicar la misma dupla de verificación usada en Inventario. Para saber quién está haciendo la petición dentro de un service o controller de Ventas sin llamar a `8081`, se lee `SecurityContextHolder.getContext().getAuthentication().getName()` (correo) o el claim `"id"` (`Long`) que ya viene firmado en el JWT.
4. **`SecurityConfig` propio de Ventas (`SecurityFilterChain` + `CorsConfigurationSource`):**
   - `csrf.disable()`, `STATELESS`, CORS para `http://localhost:5173` / `127.0.0.1:5173`, Swagger público y reglas para `/api/v1/boletas/**`:
     - `POST /api/v1/boletas` ➔ `.authenticated()` (o `permitAll()` si permiten compra de invitado).
     - `GET /api/v1/boletas` ➔ `.hasAnyRole("ADMIN", "VENDEDOR")`.
     - `GET /api/v1/boletas/{id}` y `GET /api/v1/boletas/usuario/{usuarioId}` ➔ `.authenticated()`.
5. **Estado de Clientes OpenFeign (`ms-ventas-boletas` ➔ `8081` y `8082`):**
   - **`UsuarioFeignClient` (`GET /api/v1/usuarios/{id}`):** ya está permitido en [`SecurityConfig.java`](./ms-usuarios-auth/usuarios/src/main/java/com/sonidovivo/usuarios/security/SecurityConfig.java) y los campos de [`UsuarioResponseDto.java`](./ms-usuarios-auth/usuarios/src/main/java/com/sonidovivo/usuarios/dto/UsuarioResponseDto.java) (`idUsuario`, `nombre`, `apellido`, `correo`) coinciden con [`UsuarioRemotoResponse.java`](./ms-ventas-boletas/ventas/src/main/java/com/sonidovivo/ventas/client/dto/UsuarioRemotoResponse.java).
   - **Propagación del JWT en Feign (si Inventario protege `PUT /stock`):** declarar un `@Bean RequestInterceptor` de OpenFeign en Ventas que copie el header `Authorization` del `HttpServletRequest` entrante hacia las llamadas Feign salientes.
