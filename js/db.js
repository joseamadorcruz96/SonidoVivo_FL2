/**
 * ============================================================================
 * SONIDO VIVO - Capa de Servicio y Base de Datos Simulada (Local Storage)
 * Proyecto: Tienda de Instrumentos y Equipos Musicales (Forma B - DSY1104)
 * ============================================================================
 * 
 * Este archivo actúa como la capa de persistencia central del frontend.
 * Proporciona métodos CRUD sencillos y comprensibles para manipular:
 *  - Productos (Catálogo e Inventario)
 *  - Usuarios (Autenticación y Roles RBAC: Admin, Vendedor, Cliente)
 *  - Carrito de Compras
 *  - Órdenes de Pedido
 *  - Mensajes de Contacto
 * 
 * Todos los métodos son síncronos y operan directamente sobre localStorage.
 * Expone el objeto global: window.DB
 */

(function () {
  "use strict";

  // --------------------------------------------------------------------------
  // Claves oficiales de almacenamiento en LocalStorage
  // --------------------------------------------------------------------------
  const CLAVES = {
    PRODUCTOS: "sv_productos",
    USUARIOS: "sv_usuarios",
    CARRITO: "sv_carrito",
    ORDENES: "sv_ordenes",
    MENSAJES: "sv_mensajes",
    SESION: "sv_sesion_activa"
  };

  // --------------------------------------------------------------------------
  // Datos Semilla Iniciales (Seed Data)
  // Extraídos del Catálogo Oficial de Sonido Vivo y de la Pauta de Evaluación
  // --------------------------------------------------------------------------
  const PRODUCTOS_INICIALES = [
    {
      codigo: "GA001",
      nombre: "Guitarra Acústica Folk",
      categoria: "Guitarras Acústicas",
      marca: "Yamaha",
      modelo: "F310",
      precio: 129990,
      stock: 8,
      stockCritico: 2,
      descripcion: "Tapa de abeto, aros y fondo de meranti. Ideal para estudiantes y principiantes.",
      imagen: "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=600&auto=format&fit=crop&q=80",
      destacado: false
    },
    {
      codigo: "GA003",
      nombre: "Guitarra Clásica Española 4/4",
      categoria: "Guitarras Acústicas",
      marca: "Yamaha",
      modelo: "C40",
      precio: 89990,
      stock: 10,
      stockCritico: 3,
      descripcion: "Cuerdas de nailon, tapa de abeto. Sonido cálido ideal para estudio clásico y folclor.",
      imagen: "https://images.unsplash.com/photo-1525201548942-d8732f6617a0?w=600&auto=format&fit=crop&q=80",
      destacado: false
    },
    {
      codigo: "GE001",
      nombre: "Guitarra Eléctrica Stratocaster",
      categoria: "Guitarras Eléctricas",
      marca: "Squier",
      modelo: "Affinity Strat",
      precio: 249990,
      stock: 5,
      stockCritico: 2,
      descripcion: "Cuerpo de álamo liviano, mástil de arce en 'C', 3 pastillas single-coil clásicas.",
      imagen: "https://images.unsplash.com/photo-1564186763535-ebb21ef5277f?w=600&auto=format&fit=crop&q=80",
      destacado: true
    },
    {
      codigo: "GE002",
      nombre: "Guitarra Eléctrica Les Paul Standard",
      categoria: "Guitarras Eléctricas",
      marca: "Epiphone",
      modelo: "Les Paul Std",
      precio: 329990,
      stock: 4,
      stockCritico: 2,
      descripcion: "Cuerpo de caoba con tapa de arce, 2 pastillas humbucker para rock potente y blues.",
      imagen: "https://images.unsplash.com/photo-1550985616-10810253b84d?w=600&auto=format&fit=crop&q=80",
      destacado: true
    },
    {
      codigo: "BA001",
      nombre: "Bajo Eléctrico 4 Cuerdas",
      categoria: "Bajos Eléctricos",
      marca: "Squier",
      modelo: "Affinity PJ",
      precio: 299990,
      stock: 5,
      stockCritico: 2,
      descripcion: "Configuración versátil de pastillas PJ, mástil delgado y escala estándar de 34''.",
      imagen: "https://images.unsplash.com/photo-1520523839898-5071284d7c0f?w=600&auto=format&fit=crop&q=80",
      destacado: true
    },
    {
      codigo: "BA002",
      nombre: "Bajo Eléctrico Jazz Bass",
      categoria: "Bajos Eléctricos",
      marca: "Fender",
      modelo: "Player Jazz",
      precio: 699990,
      stock: 2,
      stockCritico: 1,
      descripcion: "Cuerpo de aliso, 2 pastillas Alnico V Jazz single-coil. Definición y pegada profesional.",
      imagen: "https://images.unsplash.com/photo-1556449895-a33c9dfd3824?w=600&auto=format&fit=crop&q=80",
      destacado: false
    },
    {
      codigo: "BT001",
      nombre: "Batería Acústica 5 Piezas",
      categoria: "Baterías",
      marca: "Pearl",
      modelo: "Roadshow",
      precio: 599990,
      stock: 2,
      stockCritico: 1,
      descripcion: "Set completo listo para tocar: bombo, toms, caja, herrajes dobles, pedal y platillos.",
      imagen: "https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?w=600&auto=format&fit=crop&q=80",
      destacado: false
    },
    {
      codigo: "BT002",
      nombre: "Batería Electrónica 8 Pads",
      categoria: "Baterías",
      marca: "Roland",
      modelo: "TD-02KV",
      precio: 799990,
      stock: 2,
      stockCritico: 1,
      descripcion: "Módulo con sonidos V-Drums legendarios, pads de respuesta natural, conexión USB.",
      imagen: "https://images.unsplash.com/photo-1543443436-123927507548?w=600&auto=format&fit=crop&q=80",
      destacado: false
    },
    {
      codigo: "TC001",
      nombre: "Teclado Digital 61 Teclas",
      categoria: "Teclados y Pianos",
      marca: "Yamaha",
      modelo: "PSR-E373",
      precio: 249990,
      stock: 4,
      stockCritico: 2,
      descripcion: "61 teclas sensibles al tacto, 622 voces de alta calidad, función de lecciones y USB to Host.",
      imagen: "https://images.unsplash.com/photo-1520523839898-5071284d7c0f?w=600&auto=format&fit=crop&q=80",
      destacado: true
    },
    {
      codigo: "AM002",
      nombre: "Amplificador Guitarra 40W",
      categoria: "Amplificadores",
      marca: "Marshall",
      modelo: "MG40GFX",
      precio: 299990,
      stock: 3,
      stockCritico: 1,
      descripcion: "40 watts de potencia, 4 canales programables, efectos digitales (reverb, delay, chorus).",
      imagen: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=600&auto=format&fit=crop&q=80",
      destacado: false
    },
    {
      codigo: "PE001",
      nombre: "Pedal de Distorsión Clásico",
      categoria: "Pedales de Efectos",
      marca: "Boss",
      modelo: "DS-1",
      precio: 79990,
      stock: 7,
      stockCritico: 2,
      descripcion: "El pedal de distorsión más vendido del mundo. Ataque definido para guitarras y teclados.",
      imagen: "https://images.unsplash.com/photo-1516924962500-2b4b3b99ea02?w=600&auto=format&fit=crop&q=80",
      destacado: false
    },
    {
      codigo: "AC001",
      nombre: "Cuerdas Guitarra Eléctrica 09-42",
      categoria: "Accesorios",
      marca: "Ernie Ball",
      modelo: "Super Slinky",
      precio: 8990,
      stock: 25,
      stockCritico: 5,
      descripcion: "Juego de 6 cuerdas niqueladas para guitarra eléctrica. Calibre ligero de alta duración.",
      imagen: "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=600&auto=format&fit=crop&q=80",
      destacado: false
    }
  ];

  const USUARIOS_INICIALES = [
    {
      run: "111111111",
      nombre: "Hernán",
      apellidos: "Saavedra Administrador",
      email: "admin@sonidovivo.cl",
      password: "admin123",
      rol: "Administrador",
      region: "Valparaíso",
      comuna: "Viña del Mar",
      direccion: "Av. Libertad 1024",
      fechaNacimiento: "1988-03-15",
      activo: true
    },
    {
      run: "222222222",
      nombre: "Rodrigo",
      apellidos: "Ventas Instrumentos",
      email: "vendedor@sonidovivo.cl",
      password: "ventas123",
      rol: "Vendedor",
      region: "Valparaíso",
      comuna: "Viña del Mar",
      direccion: "Av. Libertad 1024",
      fechaNacimiento: "1994-07-22",
      activo: true
    },
    {
      run: "19011022K",
      nombre: "Estudiante",
      apellidos: "Músico Duoc",
      email: "cliente@gmail.com",
      password: "cliente123",
      rol: "Cliente",
      region: "Valparaíso",
      comuna: "Valparaíso",
      direccion: "Calle Prat 450",
      fechaNacimiento: "1998-11-04",
      activo: true
    }
  ];

  // --------------------------------------------------------------------------
  // Funciones Auxiliares de Lectura y Escritura Segura en LocalStorage
  // --------------------------------------------------------------------------
  function leer(clave, valorPorDefecto) {
    try {
      const datos = localStorage.getItem(clave);
      return datos !== null ? JSON.parse(datos) : valorPorDefecto;
    } catch (error) {
      console.error("Error al leer de localStorage (" + clave + "):", error);
      return valorPorDefecto;
    }
  }

  function escribir(clave, datos) {
    try {
      localStorage.setItem(clave, JSON.stringify(datos));
      return true;
    } catch (error) {
      console.error("Error al escribir en localStorage (" + clave + "):", error);
      return false;
    }
  }

  // --------------------------------------------------------------------------
  // Objeto Principal de la Base de Datos (Servicio Global)
  // --------------------------------------------------------------------------
  const DB = {
    /**
     * Inicializa la base de datos con datos semilla si es la primera visita.
     */
    inicializar: function () {
      // 1. Inicializar Productos
      if (!localStorage.getItem(CLAVES.PRODUCTOS)) {
        escribir(CLAVES.PRODUCTOS, PRODUCTOS_INICIALES);
        console.log("DB: Productos semilla inicializados (" + PRODUCTOS_INICIALES.length + " ítems).");
      }

      // 2. Inicializar Usuarios
      if (!localStorage.getItem(CLAVES.USUARIOS)) {
        escribir(CLAVES.USUARIOS, USUARIOS_INICIALES);
        console.log("DB: Usuarios semilla inicializados (" + USUARIOS_INICIALES.length + " usuarios).");
      }

      // 3. Inicializar Carrito vacío si no existe
      if (!localStorage.getItem(CLAVES.CARRITO)) {
        escribir(CLAVES.CARRITO, []);
      }

      // 4. Inicializar Órdenes vacías si no existen
      if (!localStorage.getItem(CLAVES.ORDENES)) {
        escribir(CLAVES.ORDENES, []);
      }

      // 5. Inicializar Mensajes vacíos si no existen
      if (!localStorage.getItem(CLAVES.MENSAJES)) {
        escribir(CLAVES.MENSAJES, []);
      }
    },

    // ========================================================================
    // MÓDULO: PRODUCTOS (Inventario y Catálogo Musical)
    // ========================================================================
    productos: {
      /**
       * Retorna todos los productos del catálogo.
       * @returns {Array} Lista de productos
       */
      obtenerTodos: function () {
        return leer(CLAVES.PRODUCTOS, []);
      },

      /**
       * Busca un producto por su código único (SKU).
       * @param {string} codigo - Código del producto (ej: "GE001")
       * @returns {Object|null} El producto encontrado o null
       */
      obtenerPorCodigo: function (codigo) {
        const productos = leer(CLAVES.PRODUCTOS, []);
        const encontrado = productos.find(function (p) {
          return p.codigo.toUpperCase() === String(codigo).toUpperCase();
        });
        return encontrado || null;
      },

      /**
       * Filtra productos por categoría musical.
       * @param {string} categoria - Nombre de la categoría o "Todos"
       * @returns {Array} Lista de productos coincidentes
       */
      obtenerPorCategoria: function (categoria) {
        const productos = leer(CLAVES.PRODUCTOS, []);
        if (!categoria || categoria === "Todos") {
          return productos;
        }
        return productos.filter(function (p) {
          return p.categoria.toLowerCase() === categoria.toLowerCase();
        });
      },

      /**
       * Retorna solo los productos marcados como destacados para el Home.
       * @returns {Array} Lista de productos destacados
       */
      obtenerDestacados: function () {
        const productos = leer(CLAVES.PRODUCTOS, []);
        return productos.filter(function (p) {
          return p.destacado === true;
        });
      },

      /**
       * Retorna productos con stock igual o inferior a su stock crítico.
       * @returns {Array} Lista de productos en estado crítico
       */
      obtenerCriticos: function () {
        const productos = leer(CLAVES.PRODUCTOS, []);
        return productos.filter(function (p) {
          return Number(p.stock) <= Number(p.stockCritico);
        });
      },

      /**
       * Guarda un producto (lo actualiza si el código existe, o lo inserta si es nuevo).
       * @param {Object} producto - Objeto producto completo
       * @returns {boolean} true si se guardó correctamente
       */
      guardar: function (producto) {
        if (!producto || !producto.codigo) return false;

        const productos = leer(CLAVES.PRODUCTOS, []);
        const indice = productos.findIndex(function (p) {
          return p.codigo.toUpperCase() === producto.codigo.toUpperCase();
        });

        if (indice >= 0) {
          // Actualización de producto existente
          productos[indice] = Object.assign({}, productos[indice], producto);
        } else {
          // Inserción de nuevo producto
          productos.push(producto);
        }

        return escribir(CLAVES.PRODUCTOS, productos);
      },

      /**
       * Elimina un producto por su código.
       * @param {string} codigo - Código del producto a remover
       * @returns {boolean} true si fue eliminado
       */
      eliminar: function (codigo) {
        const productos = leer(CLAVES.PRODUCTOS, []);
        const nuevos = productos.filter(function (p) {
          return p.codigo.toUpperCase() !== String(codigo).toUpperCase();
        });
        return escribir(CLAVES.PRODUCTOS, nuevos);
      }
    },

    // ========================================================================
    // MÓDULO: USUARIOS Y AUTENTICACIÓN (Roles RBAC)
    // ========================================================================
    usuarios: {
      /**
       * Retorna la lista completa de usuarios registrados.
       * @returns {Array}
       */
      obtenerTodos: function () {
        return leer(CLAVES.USUARIOS, []);
      },

      /**
       * Busca un usuario por su correo electrónico.
       * @param {string} email
       * @returns {Object|null}
       */
      obtenerPorEmail: function (email) {
        const usuarios = leer(CLAVES.USUARIOS, []);
        const encontrado = usuarios.find(function (u) {
          return u.email.toLowerCase() === String(email).toLowerCase();
        });
        return encontrado || null;
      },

      /**
       * Busca un usuario por su RUN chileno.
       * @param {string} run
       * @returns {Object|null}
       */
      obtenerPorRun: function (run) {
        const usuarios = leer(CLAVES.USUARIOS, []);
        const encontrado = usuarios.find(function (u) {
          return u.run.toUpperCase() === String(run).toUpperCase();
        });
        return encontrado || null;
      },

      /**
       * Registra un nuevo usuario o actualiza sus datos.
       * @param {Object} usuario
       * @returns {boolean}
       */
      guardar: function (usuario) {
        if (!usuario || !usuario.email) return false;

        const usuarios = leer(CLAVES.USUARIOS, []);
        const indice = usuarios.findIndex(function (u) {
          return u.email.toLowerCase() === usuario.email.toLowerCase();
        });

        if (indice >= 0) {
          usuarios[indice] = Object.assign({}, usuarios[indice], usuario);
        } else {
          usuarios.push(usuario);
        }

        return escribir(CLAVES.USUARIOS, usuarios);
      },

      /**
       * Elimina un usuario por su correo.
       * @param {string} email
       * @returns {boolean}
       */
      eliminar: function (email) {
        const usuarios = leer(CLAVES.USUARIOS, []);
        const nuevos = usuarios.filter(function (u) {
          return u.email.toLowerCase() !== String(email).toLowerCase();
        });
        return escribir(CLAVES.USUARIOS, nuevos);
      },

      /**
       * Valida credenciales e inicia sesión simulada.
       * @param {string} email
       * @param {string} password
       * @returns {Object|null} Retorna el usuario autenticado o null si falla
       */
      autenticar: function (email, password) {
        const usuario = this.obtenerPorEmail(email);
        if (!usuario) return null;

        if (usuario.password === password && usuario.activo !== false) {
          // Guardar sesión activa
          const sesion = {
            run: usuario.run,
            nombre: usuario.nombre,
            apellidos: usuario.apellidos,
            email: usuario.email,
            rol: usuario.rol
          };
          escribir(CLAVES.SESION, sesion);
          return sesion;
        }

        return null;
      },

      /**
       * Retorna el usuario que tiene sesión activa actualmente.
       * @returns {Object|null}
       */
      obtenerSesion: function () {
        return leer(CLAVES.SESION, null);
      },

      /**
       * Cierra la sesión activa actual.
       */
      cerrarSesion: function () {
        localStorage.removeItem(CLAVES.SESION);
      }
    },

    // ========================================================================
    // MÓDULO: CARRITO DE COMPRAS
    // ========================================================================
    carrito: {
      /**
       * Retorna la lista de ítems presentes en el carrito.
       * @returns {Array}
       */
      obtener: function () {
        return leer(CLAVES.CARRITO, []);
      },

      /**
       * Agrega un producto al carrito o incrementa sus unidades si ya existía.
       * @param {Object} producto - Objeto producto (mínimo: codigo, nombre, precio)
       * @param {number} cantidad - Unidades a incorporar (por defecto 1)
       * @returns {Array} Carrito actualizado
       */
      agregar: function (producto, cantidad) {
        if (!producto || !producto.codigo) return this.obtener();

        const unidades = Number(cantidad) > 0 ? Number(cantidad) : 1;
        const carrito = leer(CLAVES.CARRITO, []);
        const indice = carrito.findIndex(function (item) {
          return item.codigo.toUpperCase() === producto.codigo.toUpperCase();
        });

        if (indice >= 0) {
          // El producto ya estaba en el carrito: sumar unidades
          carrito[indice].cantidad = carrito[indice].cantidad + unidades;
          carrito[indice].subtotal = carrito[indice].cantidad * carrito[indice].precio;
        } else {
          // Nuevo ítem en el carrito
          carrito.push({
            codigo: producto.codigo,
            nombre: producto.nombre,
            precio: Number(producto.precio),
            cantidad: unidades,
            imagen: producto.imagen || "",
            subtotal: unidades * Number(producto.precio)
          });
        }

        escribir(CLAVES.CARRITO, carrito);
        return carrito;
      },

      /**
       * Actualiza directamente la cantidad de un ítem existente.
       * @param {string} codigo
       * @param {number} nuevaCantidad
       * @returns {Array} Carrito actualizado
       */
      actualizarCantidad: function (codigo, nuevaCantidad) {
        const unidades = Number(nuevaCantidad);
        if (unidades <= 0) {
          return this.eliminar(codigo);
        }

        const carrito = leer(CLAVES.CARRITO, []);
        const item = carrito.find(function (it) {
          return it.codigo.toUpperCase() === String(codigo).toUpperCase();
        });

        if (item) {
          item.cantidad = unidades;
          item.subtotal = item.cantidad * item.precio;
          escribir(CLAVES.CARRITO, carrito);
        }

        return carrito;
      },

      /**
       * Elimina un producto específico del carrito por su código.
       * @param {string} codigo
       * @returns {Array} Carrito actualizado
       */
      eliminar: function (codigo) {
        const carrito = leer(CLAVES.CARRITO, []);
        const nuevos = carrito.filter(function (item) {
          return item.codigo.toUpperCase() !== String(codigo).toUpperCase();
        });
        escribir(CLAVES.CARRITO, nuevos);
        return nuevos;
      },

      /**
       * Vacia por completo el carrito de compras.
       */
      vaciar: function () {
        escribir(CLAVES.CARRITO, []);
        return [];
      },

      /**
       * Calcula el monto total en pesos chilenos de los artículos en el carrito.
       * @returns {number}
       */
      obtenerTotal: function () {
        const carrito = leer(CLAVES.CARRITO, []);
        let total = 0;
        carrito.forEach(function (item) {
          total = total + (item.subtotal || (item.precio * item.cantidad));
        });
        return total;
      },

      /**
       * Calcula la suma de unidades de todos los productos (para el badge del header).
       * @returns {number}
       */
      obtenerCantidadTotal: function () {
        const carrito = leer(CLAVES.CARRITO, []);
        let cantidadTotal = 0;
        carrito.forEach(function (item) {
          cantidadTotal = cantidadTotal + (item.cantidad || 1);
        });
        return cantidadTotal;
      }
    },

    // ========================================================================
    // MÓDULO: ÓRDENES Y PEDIDOS (Para rol Vendedor y Checkout)
    // ========================================================================
    ordenes: {
      /**
       * Retorna la lista histórica de órdenes generadas.
       * @returns {Array}
       */
      obtenerTodas: function () {
        return leer(CLAVES.ORDENES, []);
      },

      /**
       * Busca una orden por su identificador único.
       * @param {string} id
       * @returns {Object|null}
       */
      obtenerPorId: function (id) {
        const ordenes = leer(CLAVES.ORDENES, []);
        const encontrada = ordenes.find(function (o) {
          return o.id === id;
        });
        return encontrada || null;
      },

      /**
       * Genera una nueva orden a partir de los datos del pedido.
       * Descuenta automáticamente el stock de los productos comprados.
       * @param {Object} ordenData - { clienteEmail, clienteNombre, items, total }
       * @returns {Object} La orden creada con ID y fecha
       */
      crear: function (ordenData) {
        const ordenes = leer(CLAVES.ORDENES, []);
        const nuevoId = "ORD-" + (1001 + ordenes.length);

        const nuevaOrden = {
          id: nuevoId,
          fecha: new Date().toLocaleString("es-CL"),
          clienteEmail: ordenData.clienteEmail || "invitado@sonidovivo.cl",
          clienteNombre: ordenData.clienteNombre || "Cliente General",
          items: ordenData.items || [],
          total: Number(ordenData.total) || 0,
          estado: "En preparación"
        };

        // 1. Descontar stock del inventario
        const productos = leer(CLAVES.PRODUCTOS, []);
        nuevaOrden.items.forEach(function (itemComprado) {
          const prod = productos.find(function (p) {
            return p.codigo.toUpperCase() === itemComprado.codigo.toUpperCase();
          });
          if (prod) {
            prod.stock = Math.max(0, prod.stock - itemComprado.cantidad);
          }
        });
        escribir(CLAVES.PRODUCTOS, productos);

        // 2. Guardar la nueva orden
        ordenes.push(nuevaOrden);
        escribir(CLAVES.ORDENES, ordenes);

        // 3. Vaciar el carrito de compras
        DB.carrito.vaciar();

        return nuevaOrden;
      },

      /**
       * Actualiza el estado de seguimiento de una orden.
       * @param {string} id
       * @param {string} nuevoEstado - "En preparación" | "Despachado" | "Entregado"
       * @returns {boolean}
       */
      actualizarEstado: function (id, nuevoEstado) {
        const ordenes = leer(CLAVES.ORDENES, []);
        const orden = ordenes.find(function (o) {
          return o.id === id;
        });
        if (orden) {
          orden.estado = nuevoEstado;
          return escribir(CLAVES.ORDENES, ordenes);
        }
        return false;
      }
    },

    // ========================================================================
    // MÓDULO: MENSAJES DE CONTACTO
    // ========================================================================
    mensajes: {
      /**
       * Retorna la lista de mensajes de contacto recibidos.
       * @returns {Array}
       */
      obtenerTodos: function () {
        return leer(CLAVES.MENSAJES, []);
      },

      /**
       * Almacena una nueva consulta de contacto.
       * @param {Object} mensaje - { nombre, email, comentario }
       * @returns {Object} El mensaje guardado con ID y fecha
       */
      guardar: function (mensaje) {
        const mensajes = leer(CLAVES.MENSAJES, []);
        const nuevoMensaje = {
          id: mensajes.length + 1,
          nombre: String(mensaje.nombre || "").trim(),
          email: String(mensaje.email || "").trim(),
          comentario: String(mensaje.comentario || "").trim(),
          fecha: new Date().toLocaleString("es-CL")
        };
        mensajes.push(nuevoMensaje);
        escribir(CLAVES.MENSAJES, mensajes);
        return nuevoMensaje;
      }
    },

    // ========================================================================
    // MÓDULO: UTILIDADES Y FORMATEO
    // ========================================================================
    utilidades: {
      /**
       * Formatea un número como moneda chilena (CLP), ej: 249990 -> "$ 249.990"
       * @param {number} valor
       * @returns {string}
       */
      formatearCLP: function (valor) {
        return "$ " + Number(valor || 0).toLocaleString("es-CL");
      },

      /**
       * Restablece la base de datos a sus valores iniciales de fábrica.
       */
      restablecerTodo: function () {
        escribir(CLAVES.PRODUCTOS, PRODUCTOS_INICIALES);
        escribir(CLAVES.USUARIOS, USUARIOS_INICIALES);
        escribir(CLAVES.CARRITO, []);
        escribir(CLAVES.ORDENES, []);
        escribir(CLAVES.MENSAJES, []);
        localStorage.removeItem(CLAVES.SESION);
        console.log("DB: Base de datos de Sonido Vivo restablecida a estado inicial.");
      }
    }
  };

  // --------------------------------------------------------------------------
  // Inicialización Automática al Cargar el Script
  // --------------------------------------------------------------------------
  DB.inicializar();

  // Exposición al ámbito global del navegador
  window.DB = DB;

})();
