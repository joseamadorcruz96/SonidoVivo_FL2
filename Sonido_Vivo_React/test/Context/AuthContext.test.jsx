import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AuthProvider, useAuth } from "../../src/Context/AuthContext";
import { obtenerToken, obtenerUsuario } from "../../src/services/api";

function ConsumidorAuthTest() {
    const { usuario, estaAutenticado, iniciarSesion, cerrarSesion } = useAuth();
    return (
        <div>
            <span data-testid="estado">{estaAutenticado ? "SI" : "NO"}</span>
            <span data-testid="correo">{usuario?.correo || "SIN_USUARIO"}</span>
            <span data-testid="rol">{usuario?.rol || "SIN_ROL"}</span>
            <button
                type="button"
                onClick={() =>
                    iniciarSesion(
                        { idUsuario: 3, nombre: "Admin", apellido: "Master", correo: "admin@gmail.com", rol: "admin" },
                        "jwt-prueba-123"
                    )
                }
            >
                Login
            </button>
            <button type="button" onClick={cerrarSesion}>
                Logout
            </button>
        </div>
    );
}

describe("AuthContext — Centralización de localStorage y persistencia ante F5", () => {
    beforeEach(() => {
        localStorage.clear();
    });

    it("hidrata la sesión al recargar (F5) cuando existen sv_token y sv_usuario válidos", () => {
        localStorage.setItem("sv_token", "jwt-valido");
        localStorage.setItem(
            "sv_usuario",
            JSON.stringify({ idUsuario: 2, correo: "vendedor@gmail.com", rol: "vendedor" })
        );

        render(
            <AuthProvider>
                <ConsumidorAuthTest />
            </AuthProvider>
        );

        expect(screen.getByTestId("estado")).toHaveTextContent("SI");
        expect(screen.getByTestId("correo")).toHaveTextContent("vendedor@gmail.com");
        expect(screen.getByTestId("rol")).toHaveTextContent("VENDEDOR");
    });

    it("limpia sesión zombie si existe sv_usuario pero falta sv_token (F5 seguro)", () => {
        localStorage.setItem(
            "sv_usuario",
            JSON.stringify({ idUsuario: 2, correo: "vendedor@gmail.com", rol: "VENDEDOR" })
        );

        render(
            <AuthProvider>
                <ConsumidorAuthTest />
            </AuthProvider>
        );

        expect(screen.getByTestId("estado")).toHaveTextContent("NO");
        expect(obtenerToken()).toBeNull();
        expect(obtenerUsuario()).toBeNull();
    });

    it("iniciarSesion guarda sv_token + sv_usuario normalizado y cerrarSesion limpia ambos", async () => {
        const user = userEvent.setup();
        localStorage.setItem("sv_sesion_activa", "legacy");
        localStorage.setItem("usuarioSonidoVivo", "legacy");

        render(
            <AuthProvider>
                <ConsumidorAuthTest />
            </AuthProvider>
        );

        await user.click(screen.getByRole("button", { name: "Login" }));
        expect(screen.getByTestId("rol")).toHaveTextContent("ADMIN");
        expect(obtenerToken()).toBe("jwt-prueba-123");
        expect(obtenerUsuario().rol).toBe("ADMIN");

        await user.click(screen.getByRole("button", { name: "Logout" }));
        expect(screen.getByTestId("estado")).toHaveTextContent("NO");
        expect(obtenerToken()).toBeNull();
        expect(obtenerUsuario()).toBeNull();
        expect(localStorage.getItem("sv_sesion_activa")).toBeNull();
        expect(localStorage.getItem("usuarioSonidoVivo")).toBeNull();
    });
});

