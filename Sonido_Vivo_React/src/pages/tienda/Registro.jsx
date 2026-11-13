import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CampoFormulario } from '../../components/CampoFormulario';
import { regionesYComunas } from '../../data/regionesComunas';
import { useAuth } from '../../Context/AuthContext';
import { registerRequest, extraerMensajeError } from '../../services/authService';
import { useForm } from '../../hooks/useForm';
import { validarRun, validarEmail, validarPassword, validarTexto } from '../../utils/validaciones';

const valoresIniciales = {
    run: '',
    nombre: '',
    apellido: '',
    correo: '',
    fechaNacimiento: '',
    region: '',
    comuna: '',
    direccion: '',
    password: '',
    confirmar: ''
};

export function Registro() {
    const navigate = useNavigate();
    const { iniciarSesion } = useAuth();
    const { datos, setDatos, errores, setErrores, handleChange } = useForm(valoresIniciales);
    const [exito, setExito] = useState(false);
    const [cargando, setCargando] = useState(false);

    const regionActiva = regionesYComunas.find(r => r.region === datos.region);
    const comunas = regionActiva ? regionActiva.comunas : [];

    const manejarCambio = (e) => {
        handleChange(e);
        if (e.target.name === 'region') {
            setDatos(prev => ({ ...prev, comuna: '' }));
        }
    };

    const validarFechaNacimiento = (fecha) => {
        if (!fecha) return 'La fecha de nacimiento es obligatoria.';
        const hoy = new Date().toISOString().split('T')[0];
        if (fecha >= hoy) return 'La fecha de nacimiento debe ser en el pasado.';
        return '';
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const nuevosErrores = {
            run: validarRun(datos.run),
            nombre: validarTexto(datos.nombre, 'El nombre', 50),
            apellido: validarTexto(datos.apellido, 'El apellido', 100),
            correo: validarEmail(datos.correo),
            fechaNacimiento: validarFechaNacimiento(datos.fechaNacimiento),
            region: !datos.region ? 'Selecciona una región.' : '',
            comuna: !datos.comuna ? 'Selecciona una comuna.' : '',
            direccion: validarTexto(datos.direccion, 'La dirección', 300),
            password: validarPassword(datos.password),
            confirmar: datos.password !== datos.confirmar ? 'Las contraseñas no coinciden.' : ''
        };

        if (Object.values(nuevosErrores).some(Boolean)) {
            setErrores(nuevosErrores);
            return;
        }

        setCargando(true);
        try {
            const { token, usuario } = await registerRequest(datos);
            iniciarSesion(usuario, token);
            setExito(true);
        } catch (err) {
            const erroresCampos = err.response?.data?.errors;
            setErrores({
                ...(erroresCampos || {}),
                general: extraerMensajeError(err, 'No se pudo completar el registro.')
            });
        } finally {
            setCargando(false);
        }
    };

    if (exito) {
        return (
            <div className="container py-5 text-center" style={{ maxWidth: '500px' }}>
                <div className="card bg-dark text-light p-4 shadow">
                    <h2 className="text-gold mb-3">¡Registro Exitoso!</h2>
                    <p className="text-secondary">
                        Tu cuenta con <strong>{datos.correo}</strong> fue creada y tu sesión JWT ya está activa.
                    </p>
                    <button onClick={() => navigate('/')} className="btn btn-hero-gold fw-bold mt-2">
                        Ir a la Tienda
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container py-5" style={{ maxWidth: '650px' }}>
            <div className="card bg-dark text-light p-4 shadow">
                <h2 className="text-center fw-bold text-gold mb-1">Crear Cuenta</h2>
                <p className="text-center text-secondary small mb-4">Completa tus datos para registrarte</p>

                {errores.general && (
                    <div className="alert alert-danger py-2 small" role="alert">{errores.general}</div>
                )}

                <form onSubmit={handleSubmit} noValidate>
                    {/* RUN */}
                    <CampoFormulario label="RUN (sin puntos ni guión)" error={errores.run} obligatorio>
                        <input
                            name="run"
                            className="form-control"
                            value={datos.run}
                            onChange={manejarCambio}
                            placeholder="Ej: 19011022K"
                            disabled={cargando}
                        />
                    </CampoFormulario>

                    {/* Nombre y Apellido */}
                    <div className="row">
                        <div className="col-md-6">
                            <CampoFormulario label="Nombre" error={errores.nombre} obligatorio>
                                <input
                                    name="nombre"
                                    className="form-control"
                                    value={datos.nombre}
                                    onChange={manejarCambio}
                                    placeholder="Matías"
                                    disabled={cargando}
                                />
                            </CampoFormulario>
                        </div>
                        <div className="col-md-6">
                            <CampoFormulario label="Apellido" error={errores.apellido} obligatorio>
                                <input
                                    name="apellido"
                                    className="form-control"
                                    value={datos.apellido}
                                    onChange={manejarCambio}
                                    placeholder="Silva Rojas"
                                    disabled={cargando}
                                />
                            </CampoFormulario>
                        </div>
                    </div>

                    {/* Correo y Fecha de Nacimiento */}
                    <div className="row">
                        <div className="col-md-7">
                            <CampoFormulario label="Correo Electrónico" error={errores.correo} obligatorio>
                                <input
                                    name="correo"
                                    type="email"
                                    className="form-control"
                                    value={datos.correo}
                                    onChange={manejarCambio}
                                    placeholder="@duoc.cl o @gmail.com"
                                    disabled={cargando}
                                />
                            </CampoFormulario>
                        </div>
                        <div className="col-md-5">
                            <CampoFormulario label="Fecha de Nacimiento" error={errores.fechaNacimiento} obligatorio>
                                <input
                                    name="fechaNacimiento"
                                    type="date"
                                    className="form-control"
                                    value={datos.fechaNacimiento}
                                    onChange={manejarCambio}
                                    disabled={cargando}
                                />
                            </CampoFormulario>
                        </div>
                    </div>

                    {/* Región y Comuna */}
                    <div className="row">
                        <div className="col-md-6">
                            <CampoFormulario label="Región" error={errores.region} obligatorio>
                                <select name="region" className="form-select" value={datos.region} onChange={manejarCambio} disabled={cargando}>
                                    <option value="">Selecciona región...</option>
                                    {regionesYComunas.map(r => (
                                        <option key={r.region} value={r.region}>{r.region}</option>
                                    ))}
                                </select>
                            </CampoFormulario>
                        </div>
                        <div className="col-md-6">
                            <CampoFormulario label="Comuna" error={errores.comuna} obligatorio>
                                <select
                                    name="comuna"
                                    className="form-select"
                                    value={datos.comuna}
                                    onChange={manejarCambio}
                                    disabled={!datos.region || cargando}
                                >
                                    <option value="">{datos.region ? 'Selecciona comuna...' : 'Elige región primero'}</option>
                                    {comunas.map(c => (
                                        <option key={c} value={c}>{c}</option>
                                    ))}
                                </select>
                            </CampoFormulario>
                        </div>
                    </div>

                    {/* Dirección */}
                    <CampoFormulario label="Dirección" error={errores.direccion} obligatorio>
                        <input
                            name="direccion"
                            className="form-control"
                            value={datos.direccion}
                            onChange={manejarCambio}
                            placeholder="Calle 123, Depto 4"
                            disabled={cargando}
                        />
                    </CampoFormulario>

                    {/* Contraseñas */}
                    <div className="row">
                        <div className="col-md-6">
                            <CampoFormulario label="Contraseña (4-10 car.)" error={errores.password} obligatorio>
                                <input
                                    name="password"
                                    type="password"
                                    className="form-control"
                                    value={datos.password}
                                    onChange={manejarCambio}
                                    placeholder="******"
                                    disabled={cargando}
                                />
                            </CampoFormulario>
                        </div>
                        <div className="col-md-6">
                            <CampoFormulario label="Confirmar Contraseña" error={errores.confirmar} obligatorio>
                                <input
                                    name="confirmar"
                                    type="password"
                                    className="form-control"
                                    value={datos.confirmar}
                                    onChange={manejarCambio}
                                    placeholder="******"
                                    disabled={cargando}
                                />
                            </CampoFormulario>
                        </div>
                    </div>

                    <button type="submit" className="btn btn-hero-gold w-100 fw-bold mt-3" disabled={cargando}>
                        {cargando ? 'Registrando...' : 'Completar Registro'}
                    </button>

                    <div className="text-center mt-3">
                        <span className="small text-secondary">¿Ya tienes cuenta? </span>
                        <Link to="/login" className="small text-gold fw-bold text-decoration-none">
                            Inicia Sesión
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
