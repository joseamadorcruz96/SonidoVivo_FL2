import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CampoFormulario } from '../../components/CampoFormulario';
import { regionesYComunas } from '../../data/regionesComunas';
import { registrarUsuario } from '../../services/db';
import {
    validarRun,
    validarEmail,
    validarPassword,
    validarTexto
} from '../../utils/validaciones';

export function Registro() {
    const navigate = useNavigate();

    // 1. Estado de los datos del formulario
    const [formulario, setFormulario] = useState({
        run: '',
        nombre: '',
        apellidos: '',
        email: '',
        fechaNacimiento: '',
        region: '',
        comuna: '',
        direccion: '',
        password: '',
        confirmarPassword: ''
    });

    // 2. Estado de errores y feedback
    const [errores, setErrores] = useState({});
    const [registroExitoso, setRegistroExitoso] = useState(false);
    const [errorServidor, setErrorServidor] = useState('');

    // Lista de comunas dependiente de la región elegida
    const regionSeleccionada = regionesYComunas.find(r => r.region === formulario.region);
    const comunasDisponibles = regionSeleccionada ? regionSeleccionada.comunas : [];

    // Manejador de cambios en inputs
    const manejarCambio = (e) => {
        const { name, value } = e.target;

        setFormulario(prev => {
            const nuevoEstado = { ...prev, [name]: value };
            // Si cambia la región, reiniciamos la comuna seleccionada
            if (name === 'region') {
                nuevoEstado.comuna = '';
            }
            return nuevoEstado;
        });

        // Limpiar error del campo al escribir
        if (errores[name]) {
            setErrores(prev => ({ ...prev, [name]: '' }));
        }
    };

    // Manejador del envío del formulario
    const manejarEnvio = (e) => {
        e.preventDefault();
        setErrorServidor('');

        // Validaciones según pauta DSY1104
        const nuevosErrores = {};

        const errRun = validarRun(formulario.run);
        if (errRun) nuevosErrores.run = errRun;

        const errNombre = validarTexto(formulario.nombre, 'El nombre', 50, 2);
        if (errNombre) nuevosErrores.nombre = errNombre;

        const errApellidos = validarTexto(formulario.apellidos, 'Los apellidos', 100, 2);
        if (errApellidos) nuevosErrores.apellidos = errApellidos;

        const errEmail = validarEmail(formulario.email);
        if (errEmail) nuevosErrores.email = errEmail;

        if (!formulario.region) {
            nuevosErrores.region = 'Debes seleccionar una región.';
        }

        if (!formulario.comuna) {
            nuevosErrores.comuna = 'Debes seleccionar una comuna.';
        }

        const errDireccion = validarTexto(formulario.direccion, 'La dirección', 300, 5);
        if (errDireccion) nuevosErrores.direccion = errDireccion;

        const errPass = validarPassword(formulario.password);
        if (errPass) nuevosErrores.password = errPass;

        if (formulario.password !== formulario.confirmarPassword) {
            nuevosErrores.confirmarPassword = 'Las contraseñas no coinciden.';
        }

        // Si hay errores, no continúa
        if (Object.keys(nuevosErrores).length > 0) {
            setErrores(nuevosErrores);
            return;
        }

        try {
            // Guardar usuario en LocalStorage mediante db.js
            registrarUsuario({
                run: formulario.run.trim().toUpperCase(),
                nombre: formulario.nombre.trim(),
                apellidos: formulario.apellidos.trim(),
                email: formulario.email.trim().toLowerCase(),
                fechaNacimiento: formulario.fechaNacimiento,
                region: formulario.region,
                comuna: formulario.comuna,
                direccion: formulario.direccion.trim(),
                password: formulario.password,
                rol: 'cliente'
            });

            setRegistroExitoso(true);
        } catch (error) {
            setErrorServidor(error.message || 'Error al registrar usuario.');
        }
    };

    // Pantalla de confirmación de registro exitoso
    if (registroExitoso) {
        return (
            <div className="container py-5 text-center" style={{ maxWidth: '600px' }}>
                <div className="card shadow-lg p-5" style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)' }}>
                    <div className="text-gold display-4 mb-3">✓</div>
                    <h2 className="text-light fw-bold mb-3">¡Registro Exitoso!</h2>
                    <p className="text-secondary mb-4">
                        Tu cuenta ha sido creada correctamente con el correo <strong>{formulario.email}</strong>. Ya puedes iniciar sesión para acceder a Sonido Vivo.
                    </p>
                    <button
                        type="button"
                        onClick={() => navigate('/login')}
                        className="btn btn-hero-gold fw-bold px-4 py-2"
                    >
                        Ir al Inicio de Sesión
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container py-5" style={{ maxWidth: '750px' }}>
            <div className="card shadow-lg" style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)' }}>
                <div className="card-body p-4 p-md-5">

                    <div className="text-center mb-4">
                        <span className="badge-hero-pill mb-2">Comunidad Musical</span>
                        <h1 className="h2 fw-bold text-light mb-2">
                            Crear Cuenta en <span className="text-gold">Sonido Vivo</span>
                        </h1>
                        <p className="text-secondary small">
                            Regístrate para comprar instrumentos y consultar tus pedidos.
                        </p>
                    </div>

                    {errorServidor && (
                        <div className="alert alert-danger py-2 text-center small mb-4" role="alert">
                            {errorServidor}
                        </div>
                    )}

                    <form onSubmit={manejarEnvio} noValidate>
                        {/* RUN */}
                        <CampoFormulario
                            label="RUN (RUT)"
                            id="reg-run"
                            error={errores.run}
                            obligatorio
                        >
                            <input
                                id="reg-run"
                                name="run"
                                type="text"
                                className={`form-control ${errores.run ? 'is-invalid' : ''}`}
                                value={formulario.run}
                                onChange={manejarCambio}
                                placeholder="Sin puntos ni guión (Ej: 19011022K)"
                                style={{ backgroundColor: 'var(--bg-body)', border: '1px solid var(--border-subtle)', color: 'var(--text-main)' }}
                            />
                        </CampoFormulario>

                        {/* Nombre y Apellidos (en fila de 2 columnas) */}
                        <div className="row">
                            <div className="col-12 col-md-6">
                                <CampoFormulario
                                    label="Nombre"
                                    id="reg-nombre"
                                    error={errores.nombre}
                                    obligatorio
                                >
                                    <input
                                        id="reg-nombre"
                                        name="nombre"
                                        type="text"
                                        className={`form-control ${errores.nombre ? 'is-invalid' : ''}`}
                                        value={formulario.nombre}
                                        onChange={manejarCambio}
                                        placeholder="Ej: Matías"
                                        style={{ backgroundColor: 'var(--bg-body)', border: '1px solid var(--border-subtle)', color: 'var(--text-main)' }}
                                    />
                                </CampoFormulario>
                            </div>

                            <div className="col-12 col-md-6">
                                <CampoFormulario
                                    label="Apellidos"
                                    id="reg-apellidos"
                                    error={errores.apellidos}
                                    obligatorio
                                >
                                    <input
                                        id="reg-apellidos"
                                        name="apellidos"
                                        type="text"
                                        className={`form-control ${errores.apellidos ? 'is-invalid' : ''}`}
                                        value={formulario.apellidos}
                                        onChange={manejarCambio}
                                        placeholder="Ej: Silva Rojas"
                                        style={{ backgroundColor: 'var(--bg-body)', border: '1px solid var(--border-subtle)', color: 'var(--text-main)' }}
                                    />
                                </CampoFormulario>
                            </div>
                        </div>

                        {/* Correo y Fecha de Nacimiento */}
                        <div className="row">
                            <div className="col-12 col-md-7">
                                <CampoFormulario
                                    label="Correo Electrónico"
                                    id="reg-email"
                                    error={errores.email}
                                    obligatorio
                                >
                                    <input
                                        id="reg-email"
                                        name="email"
                                        type="email"
                                        className={`form-control ${errores.email ? 'is-invalid' : ''}`}
                                        value={formulario.email}
                                        onChange={manejarCambio}
                                        placeholder="@duoc.cl, @profesor.duoc.cl o @gmail.com"
                                        style={{ backgroundColor: 'var(--bg-body)', border: '1px solid var(--border-subtle)', color: 'var(--text-main)' }}
                                    />
                                </CampoFormulario>
                            </div>

                            <div className="col-12 col-md-5">
                                <CampoFormulario
                                    label="Fecha de Nacimiento"
                                    id="reg-fecha"
                                >
                                    <input
                                        id="reg-fecha"
                                        name="fechaNacimiento"
                                        type="date"
                                        className="form-control"
                                        value={formulario.fechaNacimiento}
                                        onChange={manejarCambio}
                                        style={{ backgroundColor: 'var(--bg-body)', border: '1px solid var(--border-subtle)', color: 'var(--text-main)' }}
                                    />
                                </CampoFormulario>
                            </div>
                        </div>

                        {/* Select dependiente: Región y Comuna */}
                        <div className="row">
                            <div className="col-12 col-md-6">
                                <CampoFormulario
                                    label="Región"
                                    id="reg-region"
                                    error={errores.region}
                                    obligatorio
                                >
                                    <select
                                        id="reg-region"
                                        name="region"
                                        className={`form-select ${errores.region ? 'is-invalid' : ''}`}
                                        value={formulario.region}
                                        onChange={manejarCambio}
                                        style={{ backgroundColor: 'var(--bg-body)', border: '1px solid var(--border-subtle)', color: 'var(--text-main)' }}
                                    >
                                        <option value="">Selecciona una región...</option>
                                        {regionesYComunas.map(item => (
                                            <option key={item.region} value={item.region}>
                                                {item.region}
                                            </option>
                                        ))}
                                    </select>
                                </CampoFormulario>
                            </div>

                            <div className="col-12 col-md-6">
                                <CampoFormulario
                                    label="Comuna"
                                    id="reg-comuna"
                                    error={errores.comuna}
                                    obligatorio
                                >
                                    <select
                                        id="reg-comuna"
                                        name="comuna"
                                        className={`form-select ${errores.comuna ? 'is-invalid' : ''}`}
                                        value={formulario.comuna}
                                        onChange={manejarCambio}
                                        disabled={!formulario.region}
                                        style={{ backgroundColor: 'var(--bg-body)', border: '1px solid var(--border-subtle)', color: 'var(--text-main)' }}
                                    >
                                        <option value="">
                                            {formulario.region ? 'Selecciona una comuna...' : 'Primero elige una región'}
                                        </option>
                                        {comunasDisponibles.map(comuna => (
                                            <option key={comuna} value={comuna}>
                                                {comuna}
                                            </option>
                                        ))}
                                    </select>
                                </CampoFormulario>
                            </div>
                        </div>

                        {/* Dirección */}
                        <CampoFormulario
                            label="Dirección"
                            id="reg-direccion"
                            error={errores.direccion}
                            obligatorio
                        >
                            <input
                                id="reg-direccion"
                                name="direccion"
                                type="text"
                                className={`form-control ${errores.direccion ? 'is-invalid' : ''}`}
                                value={formulario.direccion}
                                onChange={manejarCambio}
                                placeholder="Calle, número, departamento o referencia"
                                style={{ backgroundColor: 'var(--bg-body)', border: '1px solid var(--border-subtle)', color: 'var(--text-main)' }}
                            />
                        </CampoFormulario>

                        {/* Contraseña y Confirmar Contraseña */}
                        <div className="row">
                            <div className="col-12 col-md-6">
                                <CampoFormulario
                                    label="Contraseña"
                                    id="reg-password"
                                    error={errores.password}
                                    obligatorio
                                >
                                    <input
                                        id="reg-password"
                                        name="password"
                                        type="password"
                                        className={`form-control ${errores.password ? 'is-invalid' : ''}`}
                                        value={formulario.password}
                                        onChange={manejarCambio}
                                        placeholder="Entre 4 y 10 caracteres"
                                        style={{ backgroundColor: 'var(--bg-body)', border: '1px solid var(--border-subtle)', color: 'var(--text-main)' }}
                                    />
                                </CampoFormulario>
                            </div>

                            <div className="col-12 col-md-6">
                                <CampoFormulario
                                    label="Confirmar Contraseña"
                                    id="reg-confirmar"
                                    error={errores.confirmarPassword}
                                    obligatorio
                                >
                                    <input
                                        id="reg-confirmar"
                                        name="confirmarPassword"
                                        type="password"
                                        className={`form-control ${errores.confirmarPassword ? 'is-invalid' : ''}`}
                                        value={formulario.confirmarPassword}
                                        onChange={manejarCambio}
                                        placeholder="Repite tu contraseña"
                                        style={{ backgroundColor: 'var(--bg-body)', border: '1px solid var(--border-subtle)', color: 'var(--text-main)' }}
                                    />
                                </CampoFormulario>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="btn btn-hero-gold w-100 py-2 fw-bold mt-3"
                        >
                            Completar Registro
                        </button>

                        <div className="text-center mt-4">
                            <span className="small text-secondary">¿Ya tienes una cuenta registrada? </span>
                            <Link to="/login" className="small text-gold fw-bold text-decoration-none">
                                Inicia Sesión
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
