// src/services/db.js

// Usuarios de prueba para evaluación y desarrollo
export const usuariosDb = [
    { id: 1, nombre: "Pedro Cliente", email: "cliente@gmail.com", password: "123", rol: "cliente" },
    { id: 2, nombre: "Ana Vendedora", email: "vendedor@gmail.com", password: "123", rol: "vendedor" },
    { id: 3, nombre: "Admin Master", email: "admin@gmail.com", password: "123", rol: "admin" },
    { id: 4, nombre: "Hernán Admin", email: "admin@sonidovivo.cl", password: "admin123", rol: "admin" },
    { id: 5, nombre: "Rodrigo Vendedor", email: "vendedor@sonidovivo.cl", password: "ventas123", rol: "vendedor" }
];

// Función para validar credenciales y guardar la sesión
export const loginUsuario = (email, password) => {
    const usuario = usuariosDb.find(u => u.email === email && u.password === password);
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