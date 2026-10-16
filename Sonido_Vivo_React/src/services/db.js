// src/services/db.js

// Usuarios de prueba iniciales para evaluación y desarrollo
export const usuariosDb = [
    { id: 1, run: "19011021K", nombre: "Pedro", apellidos: "Cliente", email: "cliente@gmail.com", password: "123", rol: "cliente" },
    { id: 2, run: "185554443", nombre: "Ana", apellidos: "Vendedora", email: "vendedor@gmail.com", password: "123", rol: "vendedor" },
    { id: 3, run: "172223334", nombre: "Admin", apellidos: "Master", email: "admin@gmail.com", password: "123", rol: "admin" },
    { id: 4, run: "164445556", nombre: "Hernán", apellidos: "Admin", email: "admin@sonidovivo.cl", password: "admin123", rol: "admin" },
    { id: 5, run: "159998887", nombre: "Rodrigo", apellidos: "Vendedor", email: "vendedor@sonidovivo.cl", password: "ventas123", rol: "vendedor" }
];

// Obtener todos los usuarios (desde LocalStorage o iniciales)
export const getUsuarios = () => {
    const guardados = localStorage.getItem('sv_usuarios');
    if (guardados) {
        return JSON.parse(guardados);
    }
    localStorage.setItem('sv_usuarios', JSON.stringify(usuariosDb));
    return usuariosDb;
};

// Registrar un nuevo usuario y persistirlo en LocalStorage
export const registrarUsuario = (nuevoUsuario) => {
    const usuarios = getUsuarios();
    
    // Evitar duplicados por correo
    const existe = usuarios.some(u => u.email.toLowerCase() === nuevoUsuario.email.toLowerCase());
    if (existe) {
        throw new Error('Ya existe una cuenta registrada con este correo electrónico.');
    }

    const usuarioConId = {
        ...nuevoUsuario,
        id: Date.now(),
        rol: nuevoUsuario.rol || 'cliente'
    };

    usuarios.push(usuarioConId);
    localStorage.setItem('sv_usuarios', JSON.stringify(usuarios));
    return usuarioConId;
};

// Función para validar credenciales y guardar la sesión activa
export const loginUsuario = (email, password) => {
    const usuarios = getUsuarios();
    const usuario = usuarios.find(
        u => u.email.toLowerCase() === (email || '').trim().toLowerCase() && u.password === password
    );

    if (usuario) {
        localStorage.setItem('usuarioSonidoVivo', JSON.stringify(usuario));
        localStorage.setItem('sv_sesion_activa', JSON.stringify(usuario));
        return usuario;
    }
    return null;
};

// Función para cerrar sesión
export const logoutUsuario = () => {
    localStorage.removeItem('usuarioSonidoVivo');
    localStorage.removeItem('sv_sesion_activa');
};

// Función para saber quién está conectado
export const getUsuarioLogueado = () => {
    const data = localStorage.getItem('usuarioSonidoVivo') || localStorage.getItem('sv_sesion_activa');
    return data ? JSON.parse(data) : null;
};