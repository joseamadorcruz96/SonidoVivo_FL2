import { useState, createContext, useContext } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [usuario, setUsuario] = useState(() => {
        const sesionGuardada = localStorage.getItem('sv_sesion_activa') || localStorage.getItem('usuarioSonidoVivo');
        return sesionGuardada ? JSON.parse(sesionGuardada) : null;
    });

    function iniciarSesion(datosUsuario) {
        setUsuario(datosUsuario);
        localStorage.setItem('sv_sesion_activa', JSON.stringify(datosUsuario));
        localStorage.setItem('usuarioSonidoVivo', JSON.stringify(datosUsuario));
    }

    function cerrarSesion() {
        setUsuario(null);
        localStorage.removeItem('sv_sesion_activa');
        localStorage.removeItem('usuarioSonidoVivo');
    }

    return (
        <AuthContext.Provider value={{
            usuario,
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
