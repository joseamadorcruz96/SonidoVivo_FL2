# 🔐 Microservicio: `ms-usuarios-auth` (Identidad, Usuarios y Autenticación JWT)

* **Puerto Asignado:** `8081`
* **Paquete Base Recomendado:** `cl.duoc.sonidovivo.usuarios`
* **Nombre de Aplicación (`spring.application.name`):** `ms-usuarios-auth`

---

## 🎯 1. Rol en el Sistema

Es el microservicio guardián de la identidad en **Sonido Vivo**. Cumple tres responsabilidades críticas dentro de la arquitectura:
1. **Autenticación y Emisión de JWT:** Valida credenciales de inicio de sesión (`email` y `password` encriptado con `BCrypt`), registra nuevos clientes y firma criptográficamente los **JSON Web Tokens (JWT)** incluyendo el `id`, `email` y `rol` del usuario.
2. **Gestión de Usuarios y Roles (RBAC):** Expone el CRUD administrativo para que el rol `ADMIN` gestione cuentas y cambie permisos (`ADMIN`, `VENDEDOR`, `CLIENTE`) desde `AdminUsuarios.jsx`.
3. **Proveedor de Identidad para OpenFeign:** Expone la consulta de usuario por ID para que `ms-ventas-boletas` (`8083`) pueda verificar de forma síncrona/bloqueante los datos del comprador al emitir una boleta.

---

## 🗄️ 2. Modelo de Datos Recomendado (1 Tabla + 1 Enum)

Alineado con la **Figura 1 del Anexo 1 (`[ USUARIO ]`)** y homologado con [`Sonido_Vivo_React/src/services/db.js`](../../Sonido_Vivo_React/src/services/db.js) y [`Registro.jsx`](../../Sonido_Vivo_React/src/pages/tienda/Registro.jsx).

### Enum `Rol` (En Java)
| Valor Enum | Valor serializado para React | Permisos según Anexo 1 |
| :--- | :--- | :--- |
| `ADMIN` | `"admin"` | Acceso total al sistema. |
| `VENDEDOR` | `"vendedor"` | Visualiza lista y detalle de productos, y lista y detalle de órdenes/boletas. |
| `CLIENTE` | `"cliente"` | Acceso exclusivo a la tienda pública y compras (Checkout). |

### Tabla: `usuarios` (Entidad JPA `Usuario`)

| Campo Java | Columna SQL | Tipo Java | Restricciones / Notas |
| :--- | :--- | :--- | :--- |
| `id` | `id` | `Long` | `PK`, Autoincremental (`GenerationType.IDENTITY`). |
| `run` | `run` | `String` | Obligatorio, largo máx. 12 (ej: `"19011021K"`). |
| `nombre` | `nombre` | `String` | Obligatorio, largo máx. 50. |
| `apellidos` | `apellidos` | `String` | Obligatorio, largo máx. 100. |
| `email` | `email` | `String` | Obligatorio, **Único (`unique = true`)**, largo máx. 100. |
| `password` | `password` | `String` | Obligatorio, almacenado como **Hash BCrypt** (60+ caracteres). Ocultar en respuestas JSON (`WRITE_ONLY`). |
| `rol` | `rol` | `Rol` / `String` | Obligatorio (`ADMIN`, `VENDEDOR`, `CLIENTE`). Por defecto `CLIENTE` al registrarse. |
| `region` | `region` | `String` | Opcional (usado para autocompletar el Checkout en React). |
| `comuna` | `comuna` | `String` | Opcional (usado para autocompletar el Checkout en React). |
| `direccion` | `direccion` | `String` | Opcional, largo máx. 300 (calle y número). |
| `fechaNacimiento` | `fecha_nacimiento` | `String` / `LocalDate` | Opcional (enviado desde `Registro.jsx`). |

---

## 📦 3. Librerías y Starters de Spring Boot que Usará

En el `pom.xml` de este microservicio se deben incluir las siguientes dependencias:

| Librería / Artefacto (`artifactId`) | Grupo (`groupId`) | Propósito en este Microservicio |
| :--- | :--- | :--- |
| `spring-boot-starter-web` | `org.springframework.boot` | Servidor Tomcat embebido y controladores REST JSON (`@RestController`). |
| `spring-boot-starter-data-jpa` | `org.springframework.boot` | Persistencia ORM con Hibernate y `JpaRepository`. |
| `spring-boot-starter-security` | `org.springframework.boot` | `BCryptPasswordEncoder`, filtros de seguridad y autorización por roles (`SecurityFilterChain`). |
| `jjwt-api`, `jjwt-impl`, `jjwt-jackson` | `io.jsonwebtoken` | Generación, firma `HMAC-SHA256` y validación de tokens **JWT** (versión recomendada `0.12.6`). |
| `springdoc-openapi-starter-webmvc-ui` | `org.springdoc` | Documentación interactiva **Swagger UI** (`/swagger-ui.html` y `/v3/api-docs`). |
| `h2` / `mysql-connector-j` | `com.h2database` / `com.mysql` | Drivers de base de datos relacional (desarrollo y producción). |
| `spring-boot-starter-test` + `spring-security-test` | `org.springframework.boot` | Pruebas unitarias de lógica de negocio con **JUnit 5 y Mockito**. |

---

## 🌐 4. Endpoints REST Recomendados (`/api/v1/...`)

### A. Autenticación Pública (`/api/v1/auth`)

| Método | Endpoint | Acceso | Cuerpo Recibido (JSON) | Respuesta Esperada (JSON) |
| :---: | :--- | :---: | :--- | :--- |
| `POST` | `/api/v1/auth/login` | Público | `{ "email": "...", "password": "..." }` | `200 OK`: `{ "token": "eyJ...", "usuario": { "id": 1, "nombre": "...", "email": "...", "rol": "cliente", ... } }`<br>`401 Unauthorized` si credenciales inválidas. |
| `POST` | `/api/v1/auth/register` | Público | `{ "run": "...", "nombre": "...", "apellidos": "...", "email": "...", "password": "...", "region": "...", "comuna": "...", "direccion": "..." }` | `201 Created`: `{ "token": "eyJ...", "usuario": { ... } }`<br>`400 Bad Request` si el correo ya existe. |

### B. Gestión de Usuarios y Consulta Feign (`/api/v1/usuarios`)

| Método | Endpoint | Acceso | Propósito / Consumidor | Respuesta Esperada |
| :---: | :--- | :---: | :--- | :--- |
| `GET` | `/api/v1/usuarios` | `ADMIN` | Lista todos los usuarios para `AdminUsuarios.jsx`. | `200 OK`: `List<Usuario>` |
| `GET` | `/api/v1/usuarios/{id}` | `ADMIN` / **OpenFeign** | Obtiene un usuario por su ID (consumido por `ms-ventas-boletas` al generar orden). | `200 OK`: `Usuario` (`404` si no existe). |
| `PUT` | `/api/v1/usuarios/{id}/rol` | `ADMIN` | Cambia el rol de un usuario desde `AdminUsuarios.jsx` (recibe `{ "rol": "vendedor" }`). | `200 OK`: `Usuario` actualizado. |
| `DELETE` | `/api/v1/usuarios/{id}` | `ADMIN` | Elimina una cuenta de usuario desde `AdminUsuarios.jsx`. | `204 No Content` |

