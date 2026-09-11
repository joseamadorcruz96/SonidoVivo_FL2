# Plan de Implementación: Tienda Online "Sonido Vivo" (Forma B - DSY1104)

Este plan de implementación detalla el desarrollo del proyecto Front End para la **Evaluación Parcial 1 (30%)** de la asignatura **Desarrollo Full Stack II (DSY1104)**, correspondiente a la tienda de instrumentos y sonido profesional **Sonido Vivo** (Viña del Mar).

El proyecto se apega estrictamente a las directrices de:
- `Contexto_Negocio/DSY1104 - Forma B - Tienda Sonido Vivo.md`
- `Contexto_Negocio/DSY1104 - Forma B - Catalogo Sonido Vivo.md`
- `Pauta_Evaluacion_Instrucciones/DSY1104 Evaluación Parcial 1 - Anexo 1 Instrucciones.md`
- `Pauta_Evaluacion_Instrucciones/DSY1104 Evaluación Parcial 1 - Anexo 2 Planilla de Requerimientos.md` (ya documentado en `documentacion/Requerimientos_Funcionales.md`)

---

## 1. Decisiones de Arquitectura y Tecnologías

Siguiendo el alcance de la **Evaluación 1 (HTML, CSS y JavaScript Vanilla sin frameworks pesados)**:
1. **Estructura Semántica**: HTML5 moderno (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`).
2. **Sistema de Diseño y Estilos (CSS)**:
   - Basado en los colores corporativos definidos en `colors.css`.
   - Variables CSS en `:root` para fácil mantenimiento y consistencia visual.
   - Enfoque responsive móvil primero (*mobile-first*), garantizando visualización óptima en:
     - Teléfonos móviles (≥ 360 px) con menú hamburguesa colapsable.
     - Tabletas (≥ 768 px) con grillas fluidas a 2 columnas.
     - Escritorio (≥ 1280 px) con grillas de 3 a 4 columnas y barra lateral fija en el panel administrativo.
3. **Lógica y Validaciones en Tiempo Real (JavaScript)**:
   - Código modular y pedagógico con comentarios explicativos claros para estudiantes.
   - Manipulación limpia del DOM y delegación de eventos.
   - Validación reactiva en eventos `input` y `blur` con retroalimentación visual inmediata.
   - Algoritmo de validación de **RUN chileno (Módulo 11)** sin puntos ni guión (7 a 9 caracteres).
   - Validación estricta de dominios de correo permitidos (`@duoc.cl`, `@profesor.duoc.cl`, `@gmail.com`).
   - Persistencia local y reglas de negocio mediante `localStorage` (Carrito de compras, catálogo ampliado y usuarios).
   - Control de Acceso Basado en Roles (RBAC simulado en cliente): **Administrador**, **Vendedor** y **Cliente**.

---

## 2. Paleta de Colores Corporativa (Sistema de Tokens)

Partiendo de la base neutra y oscura provista en `colors.css`:
- `.color1: #EDEDED` (Superficie clara / Textos de alto contraste en fondo oscuro)
- `.color2: #9CA3AF` (Gris medio / Textos secundarios / Bordes sutiles)
- `.color3: #4B5563` (Gris pizarra / Contornos / Estados inactivos)
- `.color4: #1F2937` (Gris carbón / Fondos de tarjetas / Paneles / Navbar)
- `.color5: #111827` (Negro grafito profundo / Fondo principal de la aplicación)

### Colores de Acento Complementarios (Identidad Musical & Escenario)
- **Ámbar Escenario / Primario**: `#F59E0B` (Hover: `#D97706`) → Botones de acción, llamadas a compra, estrellas de calificación e indicadores destacados.
- **Naranja Rock / Secundario**: `#EA580C` → Badges de ofertas, promociones y acentos secundarios.
- **Rojo Alerta / Peligro**: `#EF4444` → Indicador de **Stock Crítico** (`stock <= stockCritico`), errores de validación.
- **Verde Éxito**: `#10B981` → Confirmaciones de carrito, validación correcta de campos, stock saludable.
- **Azul Informativo**: `#3B82F6` → Enlaces de detalle y badges de categoría.

---

## 3. Estructura de Carpetas Propuesta

```text
Full_Stack_2_DSY1104_SonidoVivo/
├── index.html                     # Página principal (Home con hero, info de tienda y destacados)
├── productos.html                 # Catálogo completo con buscador y filtro por categoría
├── producto-detalle.html          # Ficha de producto dinámica con selector de cantidad
├── carrito.html                   # Vista de carrito de compras con persistencia y cálculo de totales
├── login.html                     # Inicio de sesión con validación de credenciales y redirección por rol
├── registro.html                  # Registro de clientes con validador de RUN y select región-comuna
├── nosotros.html                  # Historia de Sonido Vivo en Viña del Mar y equipo desarrollador
├── blog.html                      # Módulo de noticias y tips para músicos
├── blog-detalle-1.html            # Artículo 1: Guía de mantenimiento de instrumentos de cuerda
├── blog-detalle-2.html            # Artículo 2: Consejos para armar tu primera pedalera de efectos
├── contacto.html                  # Formulario de contacto con contador de caracteres y validación
│
├── admin/                         # Vistas del Sistema Administrativo (Protegidas por Rol)
│   ├── index.html                 # Dashboard principal con métricas e indicadores de stock crítico
│   ├── productos.html             # Listado tabular de productos con alertas y acciones CRUD
│   ├── producto-form.html         # Formulario para registrar o editar productos con validaciones
│   ├── usuarios.html              # Listado de usuarios registrados con sus respectivos roles
│   └── usuario-form.html          # Formulario para crear o modificar usuarios y asignar roles
│
├── css/                           # Hojas de estilo modulares
│   ├── variables.css              # Tokens de diseño: colores, tipografías, sombras y breakpoints
│   ├── base.css                   # Reset, layout global, tipografía base y utilitarios
│   ├── components.css             # Tarjetas de productos, botones, badges, modales y tablas
│   ├── forms.css                  # Estilos de formularios, estados de validación y mensajes de error
│   ├── navbar-footer.css          # Barra de navegación con menú hamburguesa y pie de página
│   └── admin.css                  # Layout de barra lateral (sidebar) y paneles de control
│
├── js/                            # Lógica JavaScript organizada pedagógicamente
│   ├── data/
│   │   ├── catalogo-data.js       # Catálogo inicial con referencias de 'Catalogo Sonido Vivo.md'
│   │   ├── regiones-comunas.js    # Arreglo estructurado de regiones y comunas de Chile
│   │   └── blogs-data.js          # Arreglo con publicaciones de noticias y artículos
│   ├── modules/
│   │   ├── validators.js          # Algoritmo Módulo 11 (RUN), regex de emails permitidos, longitudes
│   │   ├── cart.js                # Lógica del carrito: agregar, remover, actualizar en LocalStorage
│   │   ├── auth.js                # Manejo de sesión activa y control de acceso según perfil (RBAC)
│   │   └── ui.js                  # Menú hamburguesa móvil, notificaciones Toast y utilitarios DOM
│   └── pages/
│       ├── home.js                # Carga de productos destacados y banner promocional
│       ├── catalog.js             # Renderizado dinámico, búsqueda en tiempo real y filtrado
│       ├── product-detail.js      # Lectura de parámetro URL y presentación de ficha técnica
│       ├── contact.js             # Validación reactiva del formulario de contacto
│       ├── register.js            # Validación integral de registro y sincronización de selects
│       ├── login.js               # Validación de acceso y redirección inteligente
│       └── admin.js               # Lógica del dashboard, alertas de stock crítico y mantenedores
│
├── assets/                        # Recursos estáticos
│   ├── img/
│   │   ├── logo/                  # Logotipo SVG / imagen de Sonido Vivo
│   │   ├── products/              # Imágenes optimizadas representativas de cada categoría
│   │   └── blog/                  # Imágenes de portada para publicaciones
│   └── icons/                     # Iconografía SVG liviana (carrito, usuario, buscar, alerta)
│
├── documentacion/
│   └── Requerimientos_Funcionales.md # Matriz formal de RF y RNF completada según Anexo 2
├── .gitignore                     # Configuración de exclusión Git
├── colors.css                     # Referencia original de colores provista por el usuario
└── README.md                      # Manual del proyecto, arquitectura y guía de ejecución
```

---

## 4. Plan de Acción Detallado por Fases

### Fase 1: Arquitectura Base, Variables y Datos Iniciales
- Crear `css/variables.css` consolidando la paleta extendida de `colors.css`.
- Crear `css/base.css`, `css/components.css`, `css/forms.css`, `css/navbar-footer.css`.
- Configurar datos base en `js/data/catalogo-data.js` a partir de `Contexto_Negocio/DSY1104 - Forma B - Catalogo Sonido Vivo.md` (con las categorías oficiales: Guitarras, Bajos, Baterías, Teclados, Amplificadores, Micrófonos, Pedales, Accesorios, Estudio).
- Crear `js/data/regiones-comunas.js` con las regiones de Chile y sus comunas asociadas.
- Crear utilitarios de interfaz comunes (`js/modules/ui.js`) para menú hamburguesa y notificaciones.

### Fase 2: Motor de Validación y Servicios Comunes (JavaScript)
- Desarrollar `js/modules/validators.js`:
  - Algoritmo de validación de RUN chileno (cálculo de dígito verificador módulo 11, longitud 7-9 caracteres, sin puntos ni guión).
  - Validador de correo electrónico restringido a dominios `@duoc.cl`, `@profesor.duoc.cl` y `@gmail.com` con longitud máxima de 100 caracteres.
  - Validador de contraseña (entre 4 y 10 caracteres obligatorios).
  - Validador de números enteros y decimales no negativos (para precios y stock).
  - Función de feedback visual dinámico que inyecta mensajes de error accesibles bajo cada campo.
- Desarrollar `js/modules/cart.js`:
  - Métodos `getCart()`, `addToCart(productId, quantity)`, `removeFromCart(productId)`, `updateQuantity(productId, quantity)`, `clearCart()`.
  - Persistencia síncrona en `localStorage`.
  - Actualización reactiva del contador en el navbar.
- Desarrollar `js/modules/auth.js`:
  - Simulación de autenticación con roles: **Administrador**, **Vendedor**, **Cliente**.
  - Persistencia de sesión en `localStorage` / `sessionStorage`.
  - Protección de rutas: redirección si un usuario sin rol intenta entrar al panel administrativo.

### Fase 3: Construcción de Vistas de la Tienda (Públicas)
- **`index.html` (Home)**: Navbar con carrito y contador, Hero banner con la historia de 11 años en Viña del Mar, grilla de productos destacados, testimonios/servicios de luthería y footer institucional.
- **`productos.html` (Catálogo)**: Barra de búsqueda, selector de categorías dinámico, grilla responsive de productos con renderizado dinámico desde JS, precio CLP formateado y botón "Añadir al carrito".
- **`producto-detalle.html`**: Carga dinámica mediante `id` en URL, galería/imagen del producto, especificaciones técnicas, control de cantidad con límite de stock disponible y botón de compra.
- **`carrito.html`**: Tabla/lista con desglose de productos, imágenes en miniatura, controles `+` / `-`, botón de eliminar item, cálculo en tiempo real de subtotales y total en CLP, botón para vaciar y botón para confirmar pedido con resumen.
- **`registro.html`**: Formulario con validación en tiempo real de RUN (Módulo 11), nombre, apellidos, correo institucional/gmail, selector dinámico dependiente de Región y Comuna, dirección.
- **`login.html`**: Formulario de ingreso con validaciones, selector de usuario de prueba rápido (Admin, Vendedor, Cliente) para facilitar la evaluación al docente y redirección según rol.
- **`nosotros.html`**: Historia de Sonido Vivo, misión, visión, servicio de calibración y sección del equipo de estudiantes desarrolladores.
- **`blog.html`**: Listado de 2 noticias/consejos para músicos con diseño de tarjetas.
- **`blog-detalle-1.html` y `blog-detalle-2.html`**: Vistas de lectura completa de artículos.
- **`contacto.html`**: Formulario de contacto con contador de caracteres (máx. 500), validaciones inmediatas y modal de confirmación.

### Fase 4: Construcción del Sistema Administrativo (Admin & RBAC)
- **`admin/index.html`**: Layout con sidebar responsive (colapsable en móvil), tarjetas resumen de inventario, accesos directos y cuadro de **alerta inmediata de stock crítico** (`stock <= stockCritico`).
- **`admin/productos.html`**: Tabla completa de inventario con buscador, resaltado visual de productos con stock en nivel crítico, botón para agregar nuevo producto y acciones de editar/eliminar.
- **`admin/producto-form.html`**: Formulario con validaciones completas:
  - Código (mín. 3 caracteres, obligatorio).
  - Nombre (máx. 100 caracteres, obligatorio).
  - Descripción (opcional, máx. 500 caracteres).
  - Precio (mín. 0, permite decimales, 0 = FREE).
  - Stock (entero, mín. 0).
  - Stock Crítico (entero, mín. 0; advertencia visual si stock <= stock crítico).
  - Categoría (select con opciones oficiales).
  - Imagen (campo de URL o selección).
- **`admin/usuarios.html`**: Nómina de usuarios registrados, rol asignado, región/comuna y estado (restringido para Vendedores).
- **`admin/usuario-form.html`**: Formulario administrativo para dar de alta usuarios o cambiar su rol (**Administrador**, **Vendedor**, **Cliente**), con selects dependientes de Región y Comuna.

### Fase 5: Estilos Responsivos, Ajustes Visuales y Accesibilidad
- Asegurar comportamiento exacto en los 3 breakpoints requeridos:
  - Móvil (360px): Menú hamburguesa accesible, tablas con scroll horizontal adaptado, tarjetas a 1 columna.
  - Tableta (768px): Grilla a 2 columnas, sidebar adaptable.
  - Escritorio (1280px): Grilla multi-columna, visualización espaciosa y descansada.
- Aplicar micro-animaciones suaves en transiciones hover de tarjetas y botones.

### Fase 6: Verificación y Documentación de Entrega
- Pruebas cruzadas de todos los requisitos de validación con casos límite (RUTs válidos e inválidos, correos no permitidos, stock negativo o excedido en carrito).
- Generación de `README.md` exhaustivo con:
  - Descripción del proyecto y contexto de Sonido Vivo.
  - Estructura de navegación y credenciales de prueba por rol.
  - Instrucciones de despliegue local.
  - Trazabilidad con la pauta de evaluación.

---

## 5. Plan de Verificación

### Pruebas Funcionales Automatizadas y Manuales
1. **Validación de Formularios**:
   - Ingresar RUNs inválidos (ej. `11111111-9`, `123456`) y RUNs chilenos válidos para verificar cálculo de dígito verificador.
   - Probar correos `@hotmail.com` o `@yahoo.es` (deben ser rechazados) vs `@duoc.cl`, `@profesor.duoc.cl` o `@gmail.com` (deben ser aceptados).
   - Probar contraseñas de menos de 4 o más de 10 caracteres.
   - Probar campos de contacto y límites de caracteres.
2. **Dependencia Región-Comuna**:
   - Cambiar de Región (ej. Valparaíso) y comprobar que el combo de Comunas cargue Viña del Mar, Valparaíso, Concón, Quilpué, etc.
3. **Carrito de Compras y LocalStorage**:
   - Añadir 2 productos desde el catálogo y 1 desde el detalle.
   - Modificar cantidades, comprobar que el total en CLP se recalcule instantáneamente.
   - Recargar la página (`F5`) y verificar que el carrito se mantenga intacto en `localStorage`.
   - Vaciar carrito o completar pedido y verificar reset.
4. **Control de Inventario y Alertas de Stock Crítico**:
   - En el panel de administración, editar un producto fijando stock menor o igual a su stock crítico; verificar que se active el distintivo de advertencia en rojo/naranja.
   - Registrar un nuevo producto y verificar que aparezca inmediatamente en el catálogo de la tienda.
5. **Control de Acceso por Roles (RBAC)**:
   - Iniciar sesión como Cliente y verificar que no pueda ver menús administrativos.
   - Iniciar sesión como Vendedor y verificar que pueda ver productos y órdenes, pero NO el mantenedor de usuarios.
   - Iniciar sesión como Administrador y verificar acceso integral.
6. **Responsividad Multidispositivo**:
   - Probar con resolución 360px, 768px y 1280px usando herramientas de emulación de navegador.

---

## 6. Revisión del Usuario Requerida
> [!IMPORTANT]
> - ¿Estás conforme con la extensión de la paleta corporativa (`#EDEDED`, `#9CA3AF`, `#4B5563`, `#1F2937`, `#111827` + acentos ámbar/naranja de escenario musical)?
> - ¿Apruebas la estructura de carpetas y el plan de acción por fases para dar inicio a la implementación del código?
