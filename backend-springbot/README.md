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
