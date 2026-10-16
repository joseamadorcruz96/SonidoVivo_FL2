import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CampoFormulario } from '../../components/CampoFormulario';
import { regionesYComunas } from '../../data/regionesComunas';
import { registrarUsuario } from '../../services/db';
import { useForm } from '../../hooks/useForm';
import { validarRun, validarEmail, validarPassword, validarTexto } from '../../utils/validaciones';

const valoresIniciales = {
    run: '',
    nombre: '',
    apellidos: '',
    email: '',
    fechaNacimiento: '',
    region: '',
    comuna: '',
    direccion: '',
    password: '',
    confirmar: ''
};

export function Registro() {
    const navigate = useNavigate();
    const { datos, setDatos, errores, setErrores, handleChange } = useForm(valoresIniciales);
    const [exito, setExito] = useState(false);

    // Comunas dinámicas según la región elegida
    const regionActiva = regionesYComunas.find(r => r.region === datos.region);
    const comunas = regionActiva ? regionActiva.comunas : [];

    // Si cambia la región, aprovechamos handleChange y limpiamos la comuna
    const manejarCambio = (e) => {
        handleChange(e);
        if (e.target.name === 'region') {
            setDatos(prev => ({ ...prev, comuna: '' }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const nuevosErrores = {
            run: validarRun(datos.run),
            nombre: validarTexto(datos.nombre, 'El nombre', 50),
            apellidos: validarTexto(datos.apellidos, 'Los apellidos', 100),
            email: validarEmail(datos.email),
            region: !datos.region ? 'Selecciona una región' : '',
            comuna: !datos.comuna ? 'Selecciona una comuna' : '',
            direccion: validarTexto(datos.direccion, 'La dirección', 300),
            password: validarPassword(datos.password),
            confirmar: datos.password !== datos.confirmar ? 'Las contraseñas no coinciden' : ''
        };

        if (Object.values(nuevosErrores).some(Boolean)) {
            setErrores(nuevosErrores);
            return;
        }

        try {
            registrarUsuario({ ...datos, rol: 'cliente' });
            setExito(true);
        } catch (err) {
            setErrores({ general: err.message });
        }
    };

    if (exito) {
        return (
            <div className="container py-5 text-center" style={{ maxWidth: '500px' }}>
                <div className="card bg-dark text-light p-4 shadow">
                    <h2 className="text-gold mb-3">¡Registro Exitoso!</h2>
                    <p className="text-secondary">Tu cuenta con <strong>{datos.email}</strong> fue creada correctamente.</p>
                    <button onClick={() => navigate('/login')} className="btn btn-hero-gold fw-bold mt-2">
                        Ir a Iniciar Sesión
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
                    <div className="alert alert-danger py-2 small">{errores.general}</div>
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
                        />
                    </CampoFormulario>

                    {/* Nombre y Apellidos */}
                    <div className="row">
                        <div className="col-md-6">
                            <CampoFormulario label="Nombre" error={errores.nombre} obligatorio>
                                <input
                                    name="nombre"
                                    className="form-control"
                                    value={datos.nombre}
                                    onChange={manejarCambio}
                                    placeholder="Matías"
                                />
                            </CampoFormulario>
                        </div>
                        <div className="col-md-6">
                            <CampoFormulario label="Apellidos" error={errores.apellidos} obligatorio>
                                <input
                                    name="apellidos"
                                    className="form-control"
                                    value={datos.apellidos}
                                    onChange={manejarCambio}
                                    placeholder="Silva Rojas"
                                />
                            </CampoFormulario>
                        </div>
                    </div>

                    {/* Correo y Fecha de Nacimiento */}
                    <div className="row">
                        <div className="col-md-7">
                            <CampoFormulario label="Correo Electrónico" error={errores.email} obligatorio>
                                <input
                                    name="email"
                                    type="email"
                                    className="form-control"
                                    value={datos.email}
                                    onChange={manejarCambio}
                                    placeholder="@duoc.cl o @gmail.com"
                                />
                            </CampoFormulario>
                        </div>
                        <div className="col-md-5">
                            <CampoFormulario label="Fecha de Nacimiento">
                                <input
                                    name="fechaNacimiento"
                                    type="date"
                                    className="form-control"
                                    value={datos.fechaNacimiento}
                                    onChange={manejarCambio}
                                />
                            </CampoFormulario>
                        </div>
                    </div>

                    {/* Región y Comuna (Selector dependiente) */}
                    <div className="row">
                        <div className="col-md-6">
                            <CampoFormulario label="Región" error={errores.region} obligatorio>
                                <select name="region" className="form-select" value={datos.region} onChange={manejarCambio}>
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
                                    disabled={!datos.region}
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
                                />
                            </CampoFormulario>
                        </div>
                    </div>

                    <button type="submit" className="btn btn-hero-gold w-100 fw-bold mt-3">
                        Completar Registro
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
