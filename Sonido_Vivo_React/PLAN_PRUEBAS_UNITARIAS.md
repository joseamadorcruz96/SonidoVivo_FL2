# 🧪 Plan de Pruebas Unitarias — Sonido Vivo (Evaluación Parcial 1)

> **Asignatura:** Desarrollo Full Stack 2 (DSY1104)  
> **Proyecto:** Sonido Vivo — Tienda de Instrumentos Musicales y Equipamiento de Audio  
> **Framework de Pruebas:** Vitest + React Testing Library + JSDOM  

---

## 1. 🎯 Objetivo del Documento
Este documento define la **estrategia de pruebas unitarias** que implementaremos en el proyecto. El objetivo es alinear al equipo sobre **qué módulos se van a testear, cuáles no, y por qué**, basándonos en las mejores prácticas de la industria de software.

---

## 2. 🏛️ Criterio de la Industria: ¿Por qué NO probamos todo?

En el desarrollo profesional de software (siguiendo el principio de la *Testing Trophy* de Kent C. Dodds y *Pragmatic Software Testing*), **probar todo a ciegas es un antipatrón** que genera pruebas frágiles, difíciles de mantener y que aportan poco valor.

### ❌ Lo que NO testeamos con Pruebas Unitarias (Bajo ROI / Frágil):
1. **Maquetación visual y CSS:** No probamos si un `div` tiene la clase `col-md-6` o `text-gold`. Si el diseño cambia en CSS, la prueba se rompe sin que haya un error funcional real.
2. **Librerías de terceros:** No testeamos que `react-router` navegue o que `recharts` dibuje un gráfico; asumimos que las librerías ya vienen testeadas por sus creadores.
3. **Texto estático plano:** No testeamos que un encabezado diga exactamente "Bienvenido"; esos cambios son cosméticos y no representan lógica de programación.
4. **Snapshots ciegos de páginas enteras:** Generan falsos positivos constantes con cualquier ajuste visual menor.

### ✅ Lo que SÍ testeamos obligatoriamente (Alto ROI / Crítico):
1. **Cálculos matemáticos y monetarios:** Si el total del carrito o el cálculo de subtotales falla, el cliente sufre cobros erróneos y la tienda pierde dinero.
2. **Reglas de inventario y stock:** Validar que un usuario no pueda comprar más unidades de las que existen en bodega.
3. **Validación de entradas y seguridad:** Asegurar que los datos ingresados en formularios cumplan con las reglas de negocio (RUN chileno, correo institucional, contraseñas seguras).
4. **Servicios de persistencia y sesión:** Asegurar que el registro evite correos duplicados, que el login valide credenciales correctamente y que la sesión se guarde/limpie en `LocalStorage`.
5. **Renderizado condicional puro:** Componentes que cambian su estado visual según reglas lógicas estrictas (ej. Badge de Stock: Agotado, Crítico o Disponible).

---

## 3. 📋 Catálogo de Pruebas Unitarias a Implementar

### Suite 1: Validaciones de Formularios y Datos (`src/utils/validaciones.test.js`)
*Protege la integridad de los datos que ingresan los usuarios antes de guardarlos.*

| Función | Caso de Prueba | Resultado Esperado |
| :--- | :--- | :--- |
| `validarEmail` | Campo vacío o con espacios | Retorna mensaje: obligatorio |
| `validarEmail` | Dominio no institucional (ej: `@hotmail.com`, `@yahoo.com`) | Rechazado (solo `@duoc.cl`, `@profesor.duoc.cl`, `@gmail.com`) |
| `validarEmail` | Correo válido institucional o Gmail en mayúsculas/minúsculas | Aceptado (retorna `""`) |
| `validarEmail` | Correo con longitud superior a 100 caracteres | Retorna mensaje: supera longitud máxima |
| `validarPassword` | Contraseña con menos de 4 caracteres (ej: `"123"`) | Retorna mensaje de error |
| `validarPassword` | Contraseña con más de 10 caracteres | Retorna mensaje de error |
| `validarPassword` | Contraseña válida entre 4 y 10 caracteres (ej: `"pass123"`) | Aceptada (retorna `""`) |
| `validarRun` | RUN ingresado con puntos o guión (ej: `"19.011.022-K"`) | Rechazado con formato de ejemplo |
| `validarRun` | RUN con formato correcto sin puntos ni guión (ej: `"19011022K"`) | Aceptado (retorna `""`) |
| `validarRun` | RUN con longitud menor a 7 o mayor a 9 caracteres | Rechazado |
| `validarTexto` | Texto requerido vacío | Retorna mensaje: campo obligatorio |
| `validarTexto` | Texto con longitud menor a la mínima o mayor a la máxima | Retorna mensaje de rango de caracteres |

---

### Suite 2: Autenticación, Registro y Persistencia (`src/services/db.test.js`)
*Garantiza que la capa de datos simulada y la gestión de usuarios funcionen sin fallas.*

| Función | Caso de Prueba | Resultado Esperado |
| :--- | :--- | :--- |
| `getUsuarios` | Inicialización cuando `localStorage` está vacío | Retorna la lista inicial de `usuariosDb` y la persiste |
| `registrarUsuario` | Registro de un usuario nuevo con datos válidos | Retorna el objeto creado con `id` autogenerado y rol `cliente` por defecto |
| `registrarUsuario` | Intento de registro con un correo que ya existe | Lanza una excepción (`throw new Error`) impidiendo el duplicado |
| `loginUsuario` | Credenciales correctas (correo y password coinciden) | Retorna los datos del usuario y guarda la sesión en `localStorage` |
| `loginUsuario` | Contraseña incorrecta o correo no registrado | Retorna `null` y no crea sesión |
| `logoutUsuario` | Cierre de sesión de usuario | Elimina las claves `usuarioSonidoVivo` y `sv_sesion_activa` de `localStorage` |

---

### Suite 3: Lógica de Negocio del Carrito (`src/Context/CarritoContext.test.jsx`)
*Protege la lógica financiera y de inventario de la tienda.*

| Operación | Caso de Prueba | Resultado Esperado |
| :--- | :--- | :--- |
| `agregarAlCarrito` | Agregar un producto nuevo | El producto se añade con cantidad 1 o la cantidad indicada |
| `agregarAlCarrito` | Agregar un producto ya existente en el carrito | Incrementa la cantidad del ítem existente sin duplicar la tarjeta |
| `agregarAlCarrito` | Intentar agregar más unidades que el stock disponible | Limita la cantidad al stock máximo del producto (`Math.min`) |
| `cambiarCantidad` | Aumentar o disminuir unidades de un producto | Recalcula la cantidad respetando límite de stock y mínimo de 1 |
| `cambiarCantidad` | Disminuir la cantidad a 0 o menor | Quita automáticamente el producto del carrito |
| `quitarDelCarrito` | Eliminar un ítem por su código SKU | Remueve el producto de la lista |
| `vaciarCarrito` | Vaciar todo el carrito | Deja el arreglo vacío (`[]`) |
| `Totales` | Cálculo de `cantidadTotal` y `totalPagar` | Suma exacta de unidades y valor total (`precio * cantidad`) |

---

### Suite 4: Lógica de Alertas de Inventario (`src/components/BadgeStock.test.jsx`)
*Verifica que las alertas visuales de stock muestren la información correcta.*

| Props de Entrada | Estado Esperado | Renderizado / Clase |
| :--- | :--- | :--- |
| `stock: 0` | Agotado | Texto `"Agotado"`, badge rojo (`bg-danger`) |
| `stock: 2`, `stockCritico: 2` | Stock Crítico | Texto `"⚠️ Stock Crítico (2 un.)"`, badge amarillo (`bg-warning`) |
| `stock: 8`, `stockCritico: 2` | Stock Disponible | Texto `"Stock: 8 un."`, badge verde (`bg-success`) |
| `compacto: true` | Vista compacta (para tablas o móvil) | Muestra solo el número con formato reducido |

---

## 4. 🚀 Cómo Ejecutar las Pruebas

Para que cualquier miembro del equipo ejecute las pruebas en su equipo local:

```bash
# 1. Navegar a la carpeta del proyecto React
cd Sonido_Vivo_React

# 2. Ejecutar todas las pruebas unitarias una sola vez
npm test -- --run

# 3. Ejecutar pruebas en modo observador (watch) mientras desarrollas
npm test
```

---

## 5. 👥 Distribución y Estado de Avance

- [x] **Suite 1: Validaciones de Formularios** (`validaciones.test.js`) — *19 pruebas operativas.*
- [x] **Suite 2: Servicio de Base de Datos y Sesión** (`db.test.js`) — *7 pruebas operativas.*
- [x] **Suite 3: Lógica y Cálculos del Carrito** (`CarritoContext.test.jsx`) — *7 pruebas operativas.*
- [x] **Suite 4: Alertas de Inventario** (`BadgeStock.test.jsx`) — *5 pruebas operativas.*

**Total:** 4 suites / 38 pruebas unitarias automatizadas y pasando al 100%.

---

> 💡 **Nota para la defensa del proyecto:** Si el docente pregunta *"¿Por qué tienen estas pruebas y no otras?"*, la respuesta técnica es:  
> *"Nos enfocamos en una suite con alto Retorno de Inversión (ROI) basada en la Testing Trophy: protegemos los cálculos financieros del carrito, el control de inventario, la seguridad de las entradas y la persistencia de usuarios. Evitamos pruebas frágiles sobre maquetación CSS o librerías externas que aportan poco valor y aumentan el costo de mantenimiento."*
