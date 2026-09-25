// ==========================================================================
// SONIDO VIVO - Lógica de Inicio de Sesión
// ==========================================================================

document.addEventListener('DOMContentLoaded', function() {
    
    // TRUCO PARA EVALUACIÓN: Crear un vendedor por defecto si no existe
    let usuarios = JSON.parse(localStorage.getItem('usuariosSistema')) || [];
    const existeVendedor = usuarios.find(u => u.rol === 'vendedor');
    
    if (!existeVendedor) {
        usuarios.push({
            nombre: "Admin Tienda",
            email: "vendedor@sonidovivo.cl",
            password: "admin", 
            rol: "vendedor"
        });
        localStorage.setItem('usuariosSistema', JSON.stringify(usuarios));
    }

    // Capturamos el formulario exacto de tu HTML
    const formLogin = document.getElementById('login-form');
    const mensajeError = document.getElementById('login-error');

    if (formLogin) {
        formLogin.addEventListener('submit', function(evento) {
            evento.preventDefault(); 

            // Ocultar el mensaje de error por si estaba visible de un intento anterior
            if(mensajeError) mensajeError.classList.add('d-none');

            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value;

            // Buscar en el LocalStorage
            const listaUsuarios = JSON.parse(localStorage.getItem('usuariosSistema')) || [];
            const usuarioEncontrado = listaUsuarios.find(u => u.email === email && u.password === password);

            if (usuarioEncontrado) {
                // Guardar la sesión activa
                const sesion = {
                    nombre: usuarioEncontrado.nombre,
                    rol: usuarioEncontrado.rol
                };
                localStorage.setItem('usuarioActivo', JSON.stringify(sesion));

                // Redireccionar al panel correcto según el rol
                if (usuarioEncontrado.rol === 'vendedor') {
                    window.location.href = "panel_vendedor.html";
                } else if (usuarioEncontrado.rol === 'admin') {
                    window.location.href = "admin/index.html";
                } else {
                    window.location.href = "panel_cliente.html";
                }
            } else {
                // Si hay error, mostramos tu alerta roja de diseño quitándole el d-none
                if(mensajeError) mensajeError.classList.remove('d-none');
            }
        });
    }
});