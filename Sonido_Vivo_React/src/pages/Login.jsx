import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';
import {
    loginRequest,
    extraerMensajeError,
    ROLES
} from '../services/authService';
import { CampoFormulario } from '../components/CampoFormulario';
import { useForm } from '../hooks/useForm';
import logo from '../assets/logo.svg';

const ACCESOS_RAPIDOS_SEMILLA = [
    { rol: ROLES.ADMIN, etiqueta: 'Admin', correo: 'admin@gmail.com', password: '123' },
    { rol: ROLES.VENDEDOR, etiqueta: 'Vendedor', correo: 'vendedor@gmail.com', password: '123' },
    { rol: ROLES.CLIENTE, etiqueta: 'Cliente', correo: 'cliente@gmail.com', password: '123' },
];

export function Login() {
    const navigate = useNavigate();
    const { iniciarSesion } = useAuth();

    const { datos, errores, setErrores, handleChange } = useForm({ correo: '', password: '' });
    const [errorGeneral, setErrorGeneral] = useState('');
    const [cargando, setCargando] = useState(false);

    const redirigirPorRol = (rolUsuario) => {
        if (rolUsuario === ROLES.VENDEDOR) {
            navigate('/vendedor');
        } else if (rolUsuario === ROLES.ADMIN) {
            navigate('/admin');
        } else {
            navigate('/');
        }
    };

    const ejecutarLogin = async (correo, password) => {
        setErrorGeneral('');
        setCargando(true);
        try {
            const { token, usuario } = await loginRequest(correo, password);
            iniciarSesion(usuario, token);
            redirigirPorRol(usuario.rol);
        } catch (error) {
            setErrorGeneral(extraerMensajeError(error, 'Correo o contraseña incorrectos.'));
        } finally {
            setCargando(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorGeneral('');

        const correoLimpio = (datos.correo || '').trim();
        const nuevosErrores = {
            correo: !correoLimpio
                ? 'El correo electrónico es obligatorio.'
                : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correoLimpio)
                    ? 'Ingresa un formato de correo válido.'
                    : '',
            password: !datos.password ? 'La contraseña es obligatoria.' : ''
        };

        if (Object.values(nuevosErrores).some(Boolean)) {
            setErrores(nuevosErrores);
            return;
        }

        await ejecutarLogin(correoLimpio, datos.password);
    };

    return (
        <section className="d-flex align-items-center justify-content-center py-5">
            <div className="card bg-dark text-light p-4 shadow" style={{ width: '100%', maxWidth: '420px' }}>
                <div className="text-center mb-3">
                    <img src={logo} alt="Sonido Vivo" style={{ height: '48px' }} className="mb-2" />
                </div>
                <h2 className="text-center fw-bold text-gold mb-1">Iniciar Sesión</h2>
                <p className="text-center text-secondary small mb-4">Ingresa a tu cuenta de Sonido Vivo</p>

                {errorGeneral && (
                    <div className="alert alert-danger py-2 text-center small" role="alert">
                        {errorGeneral}
                    </div>
                )}

                <form onSubmit={handleSubmit} noValidate>
                    <CampoFormulario label="Correo Electrónico" error={errores.correo} obligatorio>
                        <input
                            name="correo"
                            type="email"
                            className="form-control"
                            value={datos.correo}
                            onChange={handleChange}
                            placeholder="ejemplo@gmail.com / @sonidovivo.cl"
                            disabled={cargando}
                        />
                    </CampoFormulario>

                    <CampoFormulario label="Contraseña" error={errores.password} obligatorio>
                        <input
                            name="password"
                            type="password"
                            className="form-control"
                            value={datos.password}
                            onChange={handleChange}
                            placeholder="Ingresa tu contraseña"
                            disabled={cargando}
                        />
                    </CampoFormulario>

                    <button
                        type="submit"
                        className="btn btn-hero-gold w-100 fw-bold mt-2"
                        disabled={cargando}
                    >
                        {cargando ? 'Ingresando...' : 'Ingresar'}
                    </button>

                    <div className="text-center mt-3">
                        <span className="small text-secondary">¿No tienes cuenta? </span>
                        <Link to="/registro" className="small text-gold fw-bold text-decoration-none">
                            Regístrate aquí
                        </Link>
                    </div>
                </form>

                {/* Accesos rápidos con login JWT real contra UsuarioSeeder */}
                <div className="mt-4 pt-3 border-top border-secondary text-center">
                    <p className="small text-secondary mb-2">⚡ Probar roles con JWT real:</p>
                    <div className="d-flex gap-2 justify-content-center">
                        {ACCESOS_RAPIDOS_SEMILLA.map(({ rol, etiqueta, correo, password }) => (
                            <button
                                key={rol}
                                type="button"
                                disabled={cargando}
                                onClick={() => ejecutarLogin(correo, password)}
                                className="btn btn-sm btn-outline-warning"
                            >
                                {etiqueta}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
