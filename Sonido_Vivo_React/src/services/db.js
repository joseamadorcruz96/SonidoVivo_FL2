// src/services/db.js

// Nuestros 3 usuarios de prueba
export const usuariosDb = [
    { id: 1, nombre: "Pedro Cliente", email: "cliente@gmail.com", password: "123", rol: "cliente" },
    { id: 2, nombre: "Ana Vendedora", email: "vendedor@gmail.com", password: "123", rol: "vendedor" },
    { id: 3, nombre: "Admin Master", email: "admin@gmail.com", password: "123", rol: "admin" }
];

// Función para validar credenciales y guardar la sesión[cite: 15]
export const loginUsuario = (email, password) => {
    const usuario = usuariosDb.find(u => u.email === email && u.password === password);
    if (usuario) {
        // Persistencia: Guardamos los datos del usuario en el navegador[cite: 15]
        localStorage.setItem('usuarioSonidoVivo', JSON.stringify(usuario));
        return usuario;
    }
    return null;
};

// Función para cerrar sesión
export const logoutUsuario = () => {
    localStorage.removeItem('usuarioSonidoVivo');
};

// Función para saber quién está conectado
export const getUsuarioLogueado = () => {
    const data = localStorage.getItem('usuarioSonidoVivo');
    return data ? JSON.parse(data) : null;
};