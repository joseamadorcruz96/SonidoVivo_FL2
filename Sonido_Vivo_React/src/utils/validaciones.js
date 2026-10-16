// 1. Validación de Correo Institucional / Gmail
// Pauta: Requerido, máx 100 car, solo @duoc.cl, @profesor.duoc.cl y @gmail.com
export function validarEmail(email) {
    const valor = (email || '').trim().toLowerCase();

    if (!valor) {
        return 'El correo electrónico es obligatorio.';
    }

    if (valor.length > 100) {
        return 'El correo no puede superar los 100 caracteres.';
    }

    const regexDominios = /^[^\s@]+@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/;
    if (!regexDominios.test(valor)) {
        return 'Solo se permiten correos @duoc.cl, @profesor.duoc.cl o @gmail.com';
    }

    return '';
}

// 2. Validación de Contraseña
// Pauta: Requerido, entre 4 a 10 caracteres
export function validarPassword(password) {
    const valor = password || '';

    if (!valor) {
        return 'La contraseña es obligatoria.';
    }

    if (valor.length < 4 || valor.length > 10) {
        return 'La contraseña debe tener entre 4 y 10 caracteres.';
    }

    return '';
}

// 3. Validación de RUN chileno
// Pauta: Requerido, sin puntos ni guión (Ej: 19011022K), entre 7 y 9 caracteres
export function validarRun(run) {
    const valor = (run || '').trim().toUpperCase();

    if (!valor) {
        return 'El RUN es obligatorio.';
    }

    if (valor.includes('.') || valor.includes('-')) {
        return 'Ingresa el RUN sin puntos ni guión (Ej: 19011022K).';
    }

    if (valor.length < 7 || valor.length > 9) {
        return 'El RUN debe tener entre 7 y 9 caracteres.';
    }

    // Comprobar que sean números terminados en dígito o K
    const regexRun = /^[0-9]{6,8}[0-9K]$/;
    if (!regexRun.test(valor)) {
        return 'Formato de RUN inválido (solo dígitos y K final).';
    }

    return '';
}

// 4. Validación genérica de texto (Nombre, Apellidos, Dirección, Comentario)
export function validarTexto(valor, nombreCampo, max, min = 1) {
    const texto = (valor || '').trim();

    if (!texto && min > 0) {
        return `${nombreCampo} es obligatorio.`;
    }

    if (min > 0 && texto.length < min) {
        return `${nombreCampo} debe tener al menos ${min} caracteres.`;
    }

    if (max && texto.length > max) {
        return `${nombreCampo} no puede superar los ${max} caracteres.`;
    }

    return '';
}
