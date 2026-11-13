import sVivoApi from "./api";

/**
 * Enum de roles homologado 1:1 con com.sonidovivo.usuarios.model.Rol en Spring Boot.
 */
export const ROLES = Object.freeze({
    ADMIN: "ADMIN",
    VENDEDOR: "VENDEDOR",
    CLIENTE: "CLIENTE",
});

/**
 * Normaliza cualquier variante de rol ("admin", "Administrador", "VENDEDOR")
 * al valor exacto del Enum Rol de Spring Boot ("ADMIN", "VENDEDOR", "CLIENTE").
 */
export function normalizarRol(rol) {
    const valor = (rol || "").toString().trim().toUpperCase();
    if (valor === "ADMINISTRADOR" || valor === "ADMIN") return ROLES.ADMIN;
    if (valor === "VENDEDOR") return ROLES.VENDEDOR;
    if (valor === "CLIENTE") return ROLES.CLIENTE;
    return valor;
}

/**
 * Adapta UsuarioResponseDto de Spring Boot manteniendo sus campos oficiales
 * (idUsuario, apellido, correo, rol) junto con alias compatibles para vistas legadas.
 */
export function normalizarUsuario(usuario) {
    if (!usuario) return null;

    const idUsuario = usuario.idUsuario ?? usuario.id ?? null;
    const apellido = usuario.apellido ?? usuario.apellidos ?? "";
    const correo = usuario.correo ?? usuario.email ?? "";
    const rol = normalizarRol(usuario.rol);

    return {
        ...usuario,
        idUsuario,
        id: idUsuario,
        apellido,
        apellidos: apellido,
        correo,
        email: correo,
        rol,
    };
}

/**
 * Extrae el mensaje legible desde ErrorResponse de GlobalExceptionHandler
 * o retorna un mensaje claro cuando el backend no responde.
 */
export function extraerMensajeError(error, mensajeFallback = "Ocurrió un error al comunicarse con el servidor.") {
    if (!error?.response) {
        return "No se pudo conectar con el servidor de autenticación (puerto 8081).";
    }

    const data = error.response.data;
    if (data?.errors && typeof data.errors === "object") {
        const mensajesCampos = Object.values(data.errors).filter(Boolean);
        if (mensajesCampos.length > 0) {
            return mensajesCampos.join(" | ");
        }
    }

    return data?.message || mensajeFallback;
}

/**
 * Inicia sesión contra POST /api/v1/auth/login.
 * Envía LoginRequest ({ correo, password }) y retorna { token, usuario }.
 */
export async function loginRequest(correo, password) {
    const payload = {
        correo: (correo || "").trim(),
        password: password || "",
    };

    const { data } = await sVivoApi.post("/api/v1/auth/login", payload);
    return {
        token: data.token,
        usuario: normalizarUsuario(data.usuario),
    };
}

/**
 * Registra un nuevo cliente contra POST /api/v1/auth/register.
 * Mapea los campos al contrato exacto de UsuarioRequestDto.
 */
export async function registerRequest(datosFormulario) {
    const payload = {
        run: (datosFormulario.run || "").trim().toUpperCase(),
        nombre: (datosFormulario.nombre || "").trim(),
        apellido: (datosFormulario.apellido ?? datosFormulario.apellidos ?? "").trim(),
        correo: (datosFormulario.correo ?? datosFormulario.email ?? "").trim().toLowerCase(),
        password: datosFormulario.password || "",
        numeroContacto: datosFormulario.numeroContacto?.trim() || null,
        region: datosFormulario.region || "",
        comuna: datosFormulario.comuna || "",
        direccion: (datosFormulario.direccion || "").trim(),
        fechaNacimiento: datosFormulario.fechaNacimiento || "",
    };

    const { data } = await sVivoApi.post("/api/v1/auth/register", payload);
    return {
        token: data.token,
        usuario: normalizarUsuario(data.usuario),
    };
}
