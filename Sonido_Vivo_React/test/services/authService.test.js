import { describe, it, expect, vi, beforeEach } from "vitest";
import sVivoApi from "../../src/services/api";
import {
    ROLES,
    normalizarRol,
    normalizarUsuario,
    extraerMensajeError,
    loginRequest,
    registerRequest,
} from "../../src/services/authService";

describe("authService — Contratos y Enum Rol entre React y Spring Boot", () => {
    beforeEach(() => {
        vi.restoreAllMocks();
    });

    it("normalizarRol convierte variantes minúsculas y legadas al Enum de Spring Boot", () => {
        expect(normalizarRol("admin")).toBe(ROLES.ADMIN);
        expect(normalizarRol("Administrador")).toBe(ROLES.ADMIN);
        expect(normalizarRol("vendedor")).toBe(ROLES.VENDEDOR);
        expect(normalizarRol("cliente")).toBe(ROLES.CLIENTE);
        expect(normalizarRol("ADMIN")).toBe(ROLES.ADMIN);
    });

    it("normalizarUsuario conserva contrato Spring Boot y expone alias compatibles", () => {
        const dtoBackend = {
            idUsuario: 7,
            run: "19011021K",
            nombre: "Pedro",
            apellido: "Cliente",
            correo: "cliente@gmail.com",
            rol: "cliente",
        };

        const normalizado = normalizarUsuario(dtoBackend);
        expect(normalizado.idUsuario).toBe(7);
        expect(normalizado.id).toBe(7);
        expect(normalizado.apellido).toBe("Cliente");
        expect(normalizado.apellidos).toBe("Cliente");
        expect(normalizado.correo).toBe("cliente@gmail.com");
        expect(normalizado.email).toBe("cliente@gmail.com");
        expect(normalizado.rol).toBe("CLIENTE");
    });

    it("loginRequest envía { correo, password } a /api/v1/auth/login y normaliza respuesta", async () => {
        const postSpy = vi.spyOn(sVivoApi, "post").mockResolvedValue({
            data: {
                token: "eyJ.test.jwt",
                usuario: {
                    idUsuario: 3,
                    nombre: "Admin",
                    apellido: "Master",
                    correo: "admin@gmail.com",
                    rol: "ADMIN",
                },
            },
        });

        const res = await loginRequest("  admin@gmail.com  ", "123");

        expect(postSpy).toHaveBeenCalledWith("/api/v1/auth/login", {
            correo: "admin@gmail.com",
            password: "123",
        });
        expect(res.token).toBe("eyJ.test.jwt");
        expect(res.usuario.rol).toBe("ADMIN");
        expect(res.usuario.apellidos).toBe("Master");
    });

    it("registerRequest mapea UsuarioRequestDto exacto hacia /api/v1/auth/register", async () => {
        const postSpy = vi.spyOn(sVivoApi, "post").mockResolvedValue({
            data: {
                token: "eyJ.reg.jwt",
                usuario: {
                    idUsuario: 10,
                    run: "19011022K",
                    nombre: "Matías",
                    apellido: "Silva",
                    correo: "matias@duoc.cl",
                    rol: "CLIENTE",
                },
            },
        });

        const res = await registerRequest({
            run: " 19011022k ",
            nombre: " Matías ",
            apellido: " Silva ",
            correo: " MATIAS@DUOC.CL ",
            password: "pass12",
            region: "Metropolitana",
            comuna: "Santiago",
            direccion: " Calle 123 ",
            fechaNacimiento: "2000-05-10",
        });

        expect(postSpy).toHaveBeenCalledWith("/api/v1/auth/register", {
            run: "19011022K",
            nombre: "Matías",
            apellido: "Silva",
            correo: "matias@duoc.cl",
            password: "pass12",
            numeroContacto: null,
            region: "Metropolitana",
            comuna: "Santiago",
            direccion: "Calle 123",
            fechaNacimiento: "2000-05-10",
        });
        expect(res.token).toBe("eyJ.reg.jwt");
        expect(res.usuario.rol).toBe("CLIENTE");
    });

    it("extraerMensajeError prioriza errores por campo de MethodArgumentNotValidException", () => {
        const errorValidacion = {
            response: {
                data: {
                    message: "Error de validación en los datos enviados",
                    errors: {
                        run: "El RUN es inválido",
                        fechaNacimiento: "La fecha debe ser en el pasado",
                    },
                },
            },
        };

        expect(extraerMensajeError(errorValidacion)).toBe(
            "El RUN es inválido | La fecha debe ser en el pasado"
        );
        expect(extraerMensajeError({})).toContain("8081");
    });
});

