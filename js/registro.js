document.addEventListener('DOMContentLoaded', function() {
    const formRegistro = document.getElementById('form-registro');

    if (formRegistro) {
        formRegistro.addEventListener('submit', function(evento) {
            // 1. Evitar que la página se recargue al enviar el formulario
            evento.preventDefault();

            // 2. Capturar los valores ingresados
            const nombre = document.getElementById('nombre').value.trim();
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value;
            const confirmarPassword = document.getElementById('confirmar-password').value;

            // 3. Validación de campos vacíos
            if (nombre === '' || email === '' || password === '' || confirmarPassword === '') {
                alert("Por favor, completa todos los campos.");
                return; // Detiene la ejecución
            }

            // 4. Validación de formato de correo (Regex simple)
            const expresionCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!expresionCorreo.test(email)) {
                alert("Por favor, ingresa un correo electrónico válido.");
                return;
            }

            // 5. Validación de contraseñas (Largo y coincidencia)
            if (password.length < 6) {
                alert("La contraseña debe tener al menos 6 caracteres.");
                return;
            }
            if (password !== confirmarPassword) {
                alert("Las contraseñas no coinciden. Inténtalo de nuevo.");
                return;
            }

            // 6. Guardar usuario en localStorage si pasa todas las pruebas
            let usuarios = JSON.parse(localStorage.getItem('usuariosSistema')) || [];
            
            // Verificar que el correo no esté registrado ya
            const existe = usuarios.find(u => u.email === email);
            if (existe) {
                alert("Este correo ya está registrado.");
                return;
            }

            // Crear el nuevo usuario (por defecto le damos el rol de cliente)
            const nuevoUsuario = {
                nombre: nombre,
                email: email,
                password: password,
                rol: 'cliente'
            };

            usuarios.push(nuevoUsuario);
            localStorage.setItem('usuariosSistema', JSON.stringify(usuarios));

            alert("¡Registro exitoso! Ahora puedes iniciar sesión.");
            
            // Redirigir al login
            window.location.href = "login.html";
        });
    }
});