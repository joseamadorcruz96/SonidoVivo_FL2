import { useState, createContext, useContext } from "react";
import {
    guardarToken,
    obtenerToken,
    guardarUsuario,
    obtenerUsuario,
    limpiarSesionStorage
} from "../services/api";
import { normalizarUsuario } from "../services/authService";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [usuario, setUsuario] = useState(() => {
        const token = obtenerToken();
        const user = obtenerUsuario();
        if (!token || !user) {
            limpiarSesionStorage();
            return null;
        }
        return normalizarUsuario(user);
    });

    function iniciarSesion(datosUsuario, token) {
        const usuarioNormalizado = normalizarUsuario(datosUsuario);
        setUsuario(usuarioNormalizado);
        guardarUsuario(usuarioNormalizado);
        if (token) {
            guardarToken(token);
        }
    }

    function cerrarSesion() {
        setUsuario(null);
        limpiarSesionStorage();
    }

    return (
        <AuthContext.Provider value={{
            usuario,
            estaAutenticado: Boolean(usuario),
            iniciarSesion,
            cerrarSesion
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
