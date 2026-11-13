import axios from "axios";

const SONIDO_VIVO_TOKEN_KEY = "sv_token";
const SONIDO_VIVO_USER_KEY = "sv_usuario";

export const guardarToken = (token) => localStorage.setItem(SONIDO_VIVO_TOKEN_KEY, token);
export const obtenerToken = () => localStorage.getItem(SONIDO_VIVO_TOKEN_KEY);

export const guardarUsuario = (usuario) => {
    localStorage.setItem(SONIDO_VIVO_USER_KEY, JSON.stringify(usuario));
};

export const obtenerUsuario = () => {
    const raw = localStorage.getItem(SONIDO_VIVO_USER_KEY);
    if (!raw) return null;
    try {
        return JSON.parse(raw);
    } catch {
        limpiarSesionStorage(); //limpia todo
        return null;
    }
};

export const limpiarSesionStorage = () => {
    localStorage.removeItem(SONIDO_VIVO_TOKEN_KEY);
    localStorage.removeItem(SONIDO_VIVO_USER_KEY);
    // Limpieza de claves heredadas del mock local
    localStorage.removeItem("sv_sesion_activa");
    localStorage.removeItem("usuarioSonidoVivo");
};

const sVivoApi = axios.create({
    baseURL: import.meta.env.VITE_SONIDO_VIVO_API_URL || "http://localhost:8081",
    headers: {
        "Content-Type": "application/json",
    },
});

sVivoApi.interceptors.request.use(
    (config) => {
        const token = obtenerToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// INTERCEPTOR DE RESPUESTA (Aduana de REGRESO -> maneja 401 y 403)
sVivoApi.interceptors.response.use(
    (response) => response, // 2xx pasa directo sin cambios
    (error) => {
        const status = error.response?.status;
        const urlOriginal = error.config?.url || "";
        // Caso 401: expiró un token en una ruta protegida, fallo login
        if (status === 401 && !urlOriginal.includes("/api/v1/auth/login")) {
            limpiarSesionStorage();
            if (window.location.pathname !== "/login") {
                window.location.href = "/login";
            }
        }
        // Caso 403: el usuario sí está autenticado, pero sin rol suficiente
        if (status === 403) {
            console.warn("Acceso denegado: permisos insuficientes.");
        }
        return Promise.reject(error);
    }
);
export default sVivoApi;