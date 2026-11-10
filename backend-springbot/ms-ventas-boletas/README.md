# 🧾 Microservicio: `ms-ventas-boletas` (Órdenes de Compra, Boletas y Cliente OpenFeign)

* **Puerto Asignado:** `8083`
* **Paquete Base Recomendado:** `cl.duoc.sonidovivo.ventas`
* **Nombre de Aplicación (`spring.application.name`):** `ms-ventas-boletas`

---

## 🎯 1. Rol en el Sistema

Es el microservicio orquestador del proceso de compra (Checkout) y emisión de comprobantes en **Sonido Vivo**:
1. **Procesamiento de Ventas (Maestro-Detalle):** Recibe el carrito de compras y datos de despacho desde `Checkout.jsx`, registrando la cabecera en `BOLETA` y cada ítem comprado en `DETALLE_BOLETA`.
2. **Comunicación Síncrona/Bloqueante con OpenFeign:** Antes de confirmar una boleta:
   - Consulta a **`ms-catalogo-inventario` (`8082`)** vía `@FeignClient` para verificar que cada producto (`codigo`) exista, obtener su precio oficial y descontar el stock comprado. Si un producto no tiene stock suficiente, la compra se rechaza de inmediato.
   - Consulta a **`ms-usuarios-auth` (`8081`)** vía `@FeignClient` (cuando la orden incluye `usuarioId`) para validar la existencia del comprador.
3. **Consulta de Órdenes para Admin y Vendedor:** Expone el listado y detalle de boletas para `AdminOrdenes.jsx` (accesible por `ADMIN` y `VENDEDOR` según el Anexo 1).

---

## 🗄️ 2. Modelo de Datos Recomendado (2 Tablas Maestro-Detalle `1:N`)

Alineado con la **Figura 1 del Anexo 1 (`[ USUARIO ] - - -> [ BOLETA ] ───> [ DETALLE_BOLETA ] <─── [ PRODUCTO ]`)** y homologado con [`Checkout.jsx`](../../Sonido_Vivo_React/src/pages/tienda/Checkout.jsx), [`CompraExitosa.jsx`](../../Sonido_Vivo_React/src/pages/tienda/CompraExitosa.jsx) y [`AdminOrdenes.jsx`](../../Sonido_Vivo_React/src/pages/admin/AdminOrdenes.jsx).

```text
[ BOLETA ] (1) ──────< (N) [ DETALLE_BOLETA ]
```

### Tabla 1: `boletas` (Entidad JPA `Boleta`)

| Campo Java | Columna SQL | Tipo Java | Restricciones / Notas |
| :--- | :--- | :--- | :--- |
| `id` | `id` | `Long` | `PK`, Autoincremental (`GenerationType.IDENTITY`). |
| `numeroOrden` | `numero_orden` | `String` | Generado automáticamente si no viene (ej: `"#48291034"`). |
| `codigoOrden` | `codigo_orden` | `String` | Generado automáticamente si no viene (ej: `"ORDER-891234"`). |
| `fecha` | `fecha` | `LocalDateTime` | Fecha y hora de emisión (`LocalDateTime.now()`). |
| `usuarioId` | `usuario_id` | `Long` | Referencia lógica al `id` de la tabla `usuarios` en `ms-usuarios-auth` (puede ser `null` si compra como invitado). |
| `clienteNombre` | `cliente_nombre` | `String` | Obligatorio (datos del comprador en `Checkout.jsx`). |
| `clienteApellidos` | `cliente_apellidos` | `String` | Obligatorio. |
| `clienteEmail` | `cliente_email` | `String` | Obligatorio. |
| `calle` | `calle` | `String` | Obligatorio (dirección de despacho). |
| `departamento` | `departamento` | `String` | Opcional. |
| `region` | `region` | `String` | Obligatorio (región de entrega). |
| `comuna` | `comuna` | `String` | Obligatorio (comuna de entrega). |
| `indicaciones` | `indicaciones` | `String` | Opcional (notas de entrega). |
| `total` | `total` | `Integer` | Total de la boleta calculado/validado en el servidor. |
| `estado` | `estado` | `String` | Estado de la orden (por defecto `"completada"`). |
| `items` / `detalles` | *(Tabla hija)* | `List<DetalleBoleta>` | Relación `@OneToMany(mappedBy = "boleta", cascade = CascadeType.ALL, orphanRemoval = true)`. |

### Tabla 2: `detalle_boletas` (Entidad JPA `DetalleBoleta`)

| Campo Java | Columna SQL | Tipo Java | Restricciones / Notas |
| :--- | :--- | :--- | :--- |
| `id` | `id` | `Long` | `PK`, Autoincremental (`GenerationType.IDENTITY`). |
| `boleta` | `boleta_id` | `Boleta` | Relación `@ManyToOne` (`@JoinColumn(name = "boleta_id")`, con `@JsonIgnore` para evitar bucle infinito). |
| `productoCodigo` | `producto_codigo` | `String` | Obligatorio, SKU del producto en `ms-catalogo-inventario` (ej: `"GA001"`). |
| `nombre` | `producto_nombre` | `String` | Nombre del producto al momento de la compra. |
| `precio` | `precio_unitario` | `Integer` | Precio unitario aplicado en la compra. |
| `cantidad` | `cantidad` | `Integer` | Obligatorio, `>= 1`. |
| `imagen` | `imagen` | `String` | Opcional, URL de imagen para mostrar en el comprobante (`AdminOrdenes.jsx`). |

---

## 📦 3. Librerías y Starters de Spring Boot que Usará

| Librería / Artefacto (`artifactId`) | Grupo (`groupId`) | Propósito en este Microservicio |
| :--- | :--- | :--- |
| `spring-boot-starter-web` | `org.springframework.boot` | Servidor Tomcat y controladores REST JSON. |
| `spring-boot-starter-data-jpa` | `org.springframework.boot` | Persistencia ORM con Hibernate y `JpaRepository` para `Boleta` y `DetalleBoleta`. |
| `spring-cloud-starter-openfeign` | `org.springframework.cloud` | Clientes HTTP declarativos y **síncronos/bloqueantes (`@FeignClient`)** hacia `ms-catalogo-inventario` (`8082`) y `ms-usuarios-auth` (`8081`). |
| `springdoc-openapi-starter-webmvc-ui` | `org.springdoc` | Documentación interactiva **Swagger UI** (`/swagger-ui.html` y `/v3/api-docs`). |
| `h2` / `mysql-connector-j` | `com.h2database` / `com.mysql` | Drivers de base de datos relacional. |
| `spring-boot-starter-test` | `org.springframework.boot` | Pruebas unitarias (`BoletaServiceTest`) simulando clientes Feign con **JUnit 5 y Mockito**. |

---

## 🌐 4. Endpoints REST Recomendados (`/api/v1/boletas`) y Clientes OpenFeign

### A. Endpoints Expuestos por `ms-ventas-boletas` (`8083`)

| Método | Endpoint | Rol Requerido | Propósito / Consumidor | Respuesta Esperada |
| :---: | :--- | :---: | :--- | :--- |
| `POST` | `/api/v1/boletas` | `CLIENTE` / `ADMIN` / Público | Crea una nueva boleta desde `Checkout.jsx`, validando productos y descontando stock vía OpenFeign. | `201 Created`: `Boleta` completa con sus `items`/`detalles` (`400` si no hay stock). |
| `GET` | `/api/v1/boletas` | `ADMIN` / `VENDEDOR` | Lista todas las boletas/órdenes emitidas (`AdminOrdenes.jsx`). | `200 OK`: `List<Boleta>` |
| `GET` | `/api/v1/boletas/{id}` | `ADMIN` / `VENDEDOR` / `CLIENTE` | Obtiene el detalle completo de una boleta por su ID. | `200 OK`: `Boleta` (`404` si no existe). |
| `GET` | `/api/v1/boletas/usuario/{usuarioId}` | `ADMIN` / `CLIENTE` | Obtiene el historial de compras de un usuario específico (`AdminUsuarios.jsx`). | `200 OK`: `List<Boleta>` |

### B. Interfaces `@FeignClient` que Consumirá Internamente

1. **`InventarioFeignClient` (`url = "${ms.inventario.url:http://localhost:8082}"`):**
   - `GET /api/v1/productos/codigo/{codigo}` ➔ Obtiene producto, stock actual y precio.
   - `PUT /api/v1/productos/{codigo}/stock` ➔ Descuenta las unidades compradas.
2. **`UsuarioFeignClient` (`url = "${ms.usuarios.url:http://localhost:8081}"`):**
   - `GET /api/v1/usuarios/{id}` ➔ Verifica la existencia y datos del usuario comprador.

