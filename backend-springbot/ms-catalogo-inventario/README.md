# 🎸 Microservicio: `ms-catalogo-inventario` (Catálogo, Categorías y Control de Stock)

* **Puerto Asignado:** `8082`
* **Paquete Base Recomendado:** `cl.duoc.sonidovivo.inventario`
* **Nombre de Aplicación (`spring.application.name`):** `ms-catalogo-inventario`

---

## 🎯 1. Rol en el Sistema

Es el microservicio dueño del catálogo de instrumentos musicales y del inventario en **Sonido Vivo**:
1. **Catálogo Público y Filtrado:** Alimenta las vistas de la tienda (`Inicio.jsx`, `Catalogo.jsx`, `Categorias.jsx`, `Ofertas.jsx`, `DetalleProducto.jsx`).
2. **Mantenedores Administrativos y Vista Vendedor:** Permite al `ADMIN` crear, editar y eliminar categorías y productos (`AdminCategorias.jsx`, `AdminProductos.jsx`), y permite al `VENDEDOR` visualizar productos, alertas de stock crítico y ajustar stock (`VendedorDashboard.jsx`).
3. **Control Transaccional de Stock para Ventas (vía OpenFeign):** Expone el endpoint síncrono/bloqueante que `ms-ventas-boletas` (`8083`) invoca al momento de una compra para verificar disponibilidad y descontar unidades del inventario.

---

## 🗄️ 2. Modelo de Datos Recomendado (2 Tablas Relacionadas `1:N`)

Alineado con la **Figura 1 del Anexo 1 (`[ PRODUCTO ] <─── [ CATEGORIA ]`)** y homologado con [`productosIniciales.js`](../../Sonido_Vivo_React/src/data/productosIniciales.js), [`AdminProductos.jsx`](../../Sonido_Vivo_React/src/pages/admin/AdminProductos.jsx) y [`AdminCategorias.jsx`](../../Sonido_Vivo_React/src/pages/admin/AdminCategorias.jsx).

```text
[ CATEGORIA ] (1) ──────< (N) [ PRODUCTO ]
```

### Tabla 1: `categorias` (Entidad JPA `Categoria`)

| Campo Java | Columna SQL | Tipo Java | Restricciones / Notas |
| :--- | :--- | :--- | :--- |
| `id` | `id` | `Long` | `PK`, Autoincremental (`GenerationType.IDENTITY`). |
| `nombre` | `nombre` | `String` | Obligatorio, **Único (`unique = true`)**, máx. 100 chars (ej: `"Guitarras Eléctricas"`). |
| `descripcion` | `descripcion` | `String` | Opcional, máx. 300 chars. |

### Tabla 2: `productos` (Entidad JPA `Producto`)

| Campo Java | Columna SQL | Tipo Java | Restricciones / Notas |
| :--- | :--- | :--- | :--- |
| `id` | `id` | `Long` | `PK`, Autoincremental (`GenerationType.IDENTITY`). |
| `codigo` | `codigo` | `String` | Obligatorio, **Único (`unique = true`)**, SKU usado por React (ej: `"GA001"`, `"GE001"`). |
| `nombre` | `nombre` | `String` | Obligatorio, máx. 100 chars. |
| `marca` | `marca` | `String` | Obligatorio, máx. 60 chars (ej: `"Yamaha"`, `"Fender"`). |
| `modelo` | `modelo` | `String` | Opcional, máx. 60 chars (ej: `"F310"`, `"Affinity Strat"`). |
| `precio` | `precio` | `Integer` | Obligatorio, `>= 0` (pesos chilenos, ej: `129990`). |
| `stock` | `stock` | `Integer` | Obligatorio, `>= 0` (unidades disponibles). |
| `stockCritico` | `stock_critico` | `Integer` | Obligatorio, `>= 0` (umbral para alerta en `BadgeStock` y `VendedorDashboard`). |
| `descripcion` | `descripcion` | `String` | Opcional, máx. 500 chars. |
| `imagen` | `imagen` | `String` | URL de la imagen del instrumento. |
| `destacado` | `destacado` | `Boolean` | Indica si aparece en la portada/ofertas (`true` / `false`). |
| `categoriaObj` / `categoria` | `categoria_id` | `Categoria` | Relación `@ManyToOne` (`@JoinColumn(name = "categoria_id")`). *Tip: Exponer en JSON el nombre de la categoría como `"categoria": "Guitarras Eléctricas"` para compatibilidad directa con React.* |

---

## 📦 3. Librerías y Starters de Spring Boot que Usará

| Librería / Artefacto (`artifactId`) | Grupo (`groupId`) | Propósito en este Microservicio |
| :--- | :--- | :--- |
| `spring-boot-starter-web` | `org.springframework.boot` | Servidor Tomcat y exposición de endpoints REST JSON. |
| `spring-boot-starter-data-jpa` | `org.springframework.boot` | Persistencia ORM con Hibernate y `JpaRepository` para `Categoria` y `Producto`. |
| `springdoc-openapi-starter-webmvc-ui` | `org.springdoc` | Documentación interactiva **Swagger UI** (`/swagger-ui.html` y `/v3/api-docs`). |
| `h2` / `mysql-connector-j` | `com.h2database` / `com.mysql` | Drivers de base de datos relacional (desarrollo y producción). |
| `spring-boot-starter-test` | `org.springframework.boot` | Pruebas unitarias de lógica de negocio (`ProductoServiceTest`) con **JUnit 5 y Mockito**. |

---

## 🌐 4. Endpoints REST Recomendados (`/api/v1/...`)

### A. Categorías (`/api/v1/categorias`)

| Método | Endpoint | Rol Requerido | Propósito / Consumidor | Respuesta Esperada |
| :---: | :--- | :---: | :--- | :--- |
| `GET` | `/api/v1/categorias` | Público | Lista todas las categorías (`Categorias.jsx`, `AdminCategorias.jsx`). | `200 OK`: `List<Categoria>` |
| `GET` | `/api/v1/categorias/{id}` | Público | Obtiene el detalle de una categoría por ID. | `200 OK`: `Categoria` |
| `POST` | `/api/v1/categorias` | `ADMIN` | Crea una nueva categoría (`AdminCategorias.jsx`). | `201 Created`: `Categoria` |
| `PUT` | `/api/v1/categorias/{id}` | `ADMIN` | Actualiza nombre o descripción de una categoría. | `200 OK`: `Categoria` |
| `DELETE` | `/api/v1/categorias/{id}` | `ADMIN` | Elimina una categoría (si no tiene productos asociados). | `204 No Content` |

### B. Productos e Inventario (`/api/v1/productos`)

| Método | Endpoint | Rol Requerido | Propósito / Consumidor | Respuesta Esperada |
| :---: | :--- | :---: | :--- | :--- |
| `GET` | `/api/v1/productos` | Público / `VENDEDOR` / `ADMIN` | Lista el catálogo completo de productos. | `200 OK`: `List<Producto>` |
| `GET` | `/api/v1/productos/codigo/{codigo}` | Público / `VENDEDOR` / **OpenFeign** | Obtiene un producto por su SKU (ej: `"GA001"`). Usado por `DetalleProducto.jsx` y por `ms-ventas-boletas`. | `200 OK`: `Producto` (`404` si no existe). |
| `POST` | `/api/v1/productos` | `ADMIN` | Crea un nuevo producto en el catálogo (`AdminProductos.jsx`). | `201 Created`: `Producto` |
| `PUT` | `/api/v1/productos/{codigo}` | `ADMIN` | Actualiza un producto existente por su código SKU. | `200 OK`: `Producto` |
| `PUT` | `/api/v1/productos/{codigo}/stock` | `VENDEDOR` / `ADMIN` / **OpenFeign** | Ajusta o descuenta el stock de un producto (recibe `{ "cantidadCambio": -2 }` o `{ "nuevoStock": 6 }`). Valida que el stock resultante nunca sea menor a `0`. | `200 OK`: `Producto` actualizado (`400 Bad Request` si stock insuficiente). |
| `DELETE` | `/api/v1/productos/{codigo}` | `ADMIN` | Elimina un producto del catálogo por su SKU. | `204 No Content` |

