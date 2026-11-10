# 🚪 Servicio: `api-gateway` (Puerta de Enlace Única, CORS y Swagger Centralizado)

* **Puerto Asignado:** `8080`
* **Paquete Base Recomendado:** `cl.duoc.sonidovivo.gateway`
* **Nombre de Aplicación (`spring.application.name`):** `api-gateway`

---

## 🎯 1. Rol en el Sistema

Es el punto único de entrada HTTP (`http://localhost:8080`) para el frontend **`Sonido_Vivo_React` (`http://localhost:5173`)** y para las pruebas externas en **Postman / Swagger**:
1. **Enrutamiento Transparente (Reverse Proxy):** Redirige cada petición entrante `/api/v1/...` hacia el microservicio dueño del dominio (`8081`, `8082` u `8083`) de forma síncrona/bloqueante.
2. **Configuración Centralizada de CORS:** Permite peticiones desde el origen de React (`http://localhost:5173` y dominio de producción) y habilita el envío de la cabecera `Authorization: Bearer <token>`.
3. **Documentación Swagger UI Centralizada:** Agrega las definiciones OpenAPI (`/v3/api-docs`) de los 3 microservicios de negocio en una sola interfaz web (`http://localhost:8080/swagger-ui.html`) con un selector desplegable en la esquina superior derecha.

---

## 🗄️ 2. Modelo de Datos

* **No posee tablas propias en la base de datos.** Su responsabilidad es 100% de red, enrutamiento, seguridad perimetral y agregación de documentación OpenAPI.

---

## 📦 3. Librerías y Starters de Spring Boot que Usará

| Librería / Artefacto (`artifactId`) | Grupo (`groupId`) | Propósito en este Servicio |
| :--- | :--- | :--- |
| `spring-cloud-starter-gateway-mvc` | `org.springframework.cloud` | Enrutador HTTP **síncrono/bloqueante** basado en Spring WebMVC (Servlet/Tomcat), 100% compatible con `springdoc-openapi-starter-webmvc-ui`. |
| `springdoc-openapi-starter-webmvc-ui` | `org.springdoc` | Portal **Swagger UI Centralizado** en el puerto `8080` para visualizar y probar los 3 microservicios desde un solo lugar. |
| `spring-boot-starter-test` | `org.springframework.boot` | Pruebas de contexto y ruteo del Gateway. |

---

## 🌐 4. Tabla de Enrutamiento y Endpoints Proxy (`Puerto 8080`)

| Ruta Entrante en el Gateway (`8080`) | Microservicio Destino | URL Destino por Defecto | Contenido Enrutado |
| :--- | :--- | :--- | :--- |
| `/api/v1/auth/**` | `ms-usuarios-auth` | `http://localhost:8081` | Login (`POST /login`) y Registro (`POST /register`). |
| `/api/v1/usuarios/**` | `ms-usuarios-auth` | `http://localhost:8081` | Mantenedor de usuarios y roles (`GET`, `PUT`, `DELETE`). |
| `/api/v1/categorias/**` | `ms-catalogo-inventario` | `http://localhost:8082` | CRUD de categorías de instrumentos. |
| `/api/v1/productos/**` | `ms-catalogo-inventario` | `http://localhost:8082` | Catálogo de instrumentos y ajuste/descuento de stock. |
| `/api/v1/boletas/**` | `ms-ventas-boletas` | `http://localhost:8083` | Emisión de compras (Checkout) y consulta de órdenes. |
| `/v3/api-docs/usuarios`<br>`/v3/api-docs/inventario`<br>`/v3/api-docs/ventas` | Los 3 Microservicios | `8081`, `8082`, `8083` | Rutas de documentación OpenAPI consumidas por el **Swagger UI Centralizado** en `http://localhost:8080/swagger-ui.html`. |

