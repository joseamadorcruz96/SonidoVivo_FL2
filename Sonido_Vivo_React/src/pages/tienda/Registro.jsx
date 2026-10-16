import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CampoFormulario } from '../../components/CampoFormulario';
import { regionesYComunas } from '../../data/regionesComunas';
import { registrarUsuario } from '../../services/db';
import { validarRun, validarEmail, validarPassword, validarTexto } from '../../utils/validaciones';

export function Registro() {
    const navigate = useNavigate();

    // 1. Estado simple del formulario
    const [form, setForm] = useState({
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
    });

    const [errores, setErrores] = useState({});
    const [exito, setExito] = useState(false);

    // 2. Comunas dinámicas según la región elegida
    const regionActiva = regionesYComunas.find(r => r.region === form.region);
    const comunas = regionActiva ? regionActiva.comunas : [];

    // 3. Manejador de cambio único para todos los campos
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: value,
            ...(name === 'region' ? { comuna: '' } : {}) // limpia comuna si cambia región
        }));

        if (errores[name]) {
            setErrores(prev => ({ ...prev, [name]: '' }));
        }
    };

    // 4. Manejador de envío con validaciones directas
    const handleSubmit = (e) => {
        e.preventDefault();

        // Validamos todos los campos en un solo objeto limpio
        const nuevosErrores = {
            run: validarRun(form.run),
            nombre: validarTexto(form.nombre, 'El nombre', 50),
            apellidos: validarTexto(form.apellidos, 'Los apellidos', 100),
            email: validarEmail(form.email),
            region: !form.region ? 'Selecciona una región' : '',
            comuna: !form.comuna ? 'Selecciona una comuna' : '',
            direccion: validarTexto(form.direccion, 'La dirección', 300),
            password: validarPassword(form.password),
            confirmar: form.password !== form.confirmar ? 'Las contraseñas no coinciden' : ''
        };

        // Si alguno tiene mensaje de error, no continuamos
        if (Object.values(nuevosErrores).some(Boolean)) {
            setErrores(nuevosErrores);
            return;
        }

        try {
            registrarUsuario({ ...form, rol: 'cliente' });
            setExito(true);
        } catch (err) {
            setErrores({ general: err.message });
        }
    };

    // Vista de confirmación sencilla
    if (exito) {
        return (
            <div className="container py-5 text-center" style={{ maxWidth: '500px' }}>
                <div className="card bg-dark text-light p-4 shadow">
                    <h2 className="text-gold mb-3">¡Registro Exitoso!</h2>
                    <p className="text-secondary">Tu cuenta con <strong>{form.email}</strong> fue creada correctamente.</p>
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
                            value={form.run}
                            onChange={handleChange}
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
                                    value={form.nombre}
                                    onChange={handleChange}
                                    placeholder="Matías"
                                />
                            </CampoFormulario>
                        </div>
                        <div className="col-md-6">
                            <CampoFormulario label="Apellidos" error={errores.apellidos} obligatorio>
                                <input
                                    name="apellidos"
                                    className="form-control"
                                    value={form.apellidos}
                                    onChange={handleChange}
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
                                    value={form.email}
                                    onChange={handleChange}
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
                                    value={form.fechaNacimiento}
                                    onChange={handleChange}
                                />
                            </CampoFormulario>
                        </div>
                    </div>

                    {/* Región y Comuna (Selector dependiente) */}
                    <div className="row">
                        <div className="col-md-6">
                            <CampoFormulario label="Región" error={errores.region} obligatorio>
                                <select name="region" className="form-select" value={form.region} onChange={handleChange}>
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
                                    value={form.comuna}
                                    onChange={handleChange}
                                    disabled={!form.region}
                                >
                                    <option value="">{form.region ? 'Selecciona comuna...' : 'Elige región primero'}</option>
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
                            value={form.direccion}
                            onChange={handleChange}
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
                                    value={form.password}
                                    onChange={handleChange}
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
                                    value={form.confirmar}
                                    onChange={handleChange}
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
