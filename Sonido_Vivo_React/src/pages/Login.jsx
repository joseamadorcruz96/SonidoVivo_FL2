import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUsuario, usuariosDb } from '../services/db';
import { useAuth } from '../Context/AuthContext';
import { CampoFormulario } from '../components/CampoFormulario';
import { validarEmail, validarPassword } from '../utils/validaciones';

export function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errores, setErrores] = useState({});
    const [errorGeneral, setErrorGeneral] = useState('');
    
    const navigate = useNavigate();
    const { iniciarSesion } = useAuth();

    const autenticarYRedirigir = (usuario) => {
        iniciarSesion(usuario);
        const rol = (usuario.rol || '').toLowerCase();
        if (rol === 'admin' || rol === 'administrador') {
            navigate('/admin'); 
        } else if (rol === 'vendedor') {
            navigate('/vendedor');
        } else {
            navigate('/');
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault(); 
        setErrorGeneral('');

        // 1. Validaciones según pauta DSY1104
        const errorEmail = validarEmail(email);
        const errorPass = validarPassword(password);

        if (errorEmail || errorPass) {
            setErrores({
                email: errorEmail,
                password: errorPass
            });
            return;
        }

        setErrores({});

        // 2. Comprobar credenciales
        const usuario = loginUsuario(email, password);

        if (usuario) {
            autenticarYRedirigir(usuario);
        } else {
            setErrorGeneral('Correo o contraseña incorrectos. Verifica tus datos.');
        }
    };

    // Accesos rápidos para facilitar pruebas de evaluación al docente
    const loginRapido = (rolObjetivo) => {
        const usuarioDemo = usuariosDb.find(u => u.rol.toLowerCase() === rolObjetivo.toLowerCase());
        if (usuarioDemo) {
            setErrorGeneral('');
            setErrores({});
            autenticarYRedirigir(usuarioDemo);
        }
    };

    return (
        <section className="d-flex align-items-center justify-content-center py-5" style={{ minHeight: '80vh' }}>
            <div className="card shadow-lg" style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', width: '100%', maxWidth: '420px', borderRadius: 'var(--radius-lg)' }}>
                <div className="card-body p-4 p-md-5">
                    
                    <div className="text-center mb-4">
                        <h2 className="fw-bold" style={{ color: 'var(--text-main)', fontFamily: 'var(--font-heading)' }}>Iniciar Sesión</h2>
                        <p className="text-secondary small">Ingresa a tu cuenta de Sonido Vivo</p>
                    </div>

                    {errorGeneral && (
                        <div className="alert alert-danger py-2 text-center small" role="alert">
                            {errorGeneral}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} noValidate>
                        {/* Campo de Correo con CampoFormulario */}
                        <CampoFormulario
                            label="Correo Electrónico"
                            id="login-email"
                            error={errores.email}
                            obligatorio
                        >
                            <input
                                id="login-email"
                                type="email"
                                className={`form-control ${errores.email ? 'is-invalid' : ''}`}
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    if (errores.email) setErrores(prev => ({ ...prev, email: '' }));
                                }}
                                placeholder="ejemplo@gmail.com / @duoc.cl"
                                style={{ backgroundColor: 'var(--bg-body)', border: '1px solid var(--border-subtle)', color: 'var(--text-main)' }}
                            />
                        </CampoFormulario>

                        {/* Campo de Contraseña con CampoFormulario */}
                        <CampoFormulario
                            label="Contraseña"
                            id="login-password"
                            error={errores.password}
                            obligatorio
                        >
                            <input
                                id="login-password"
                                type="password"
                                className={`form-control ${errores.password ? 'is-invalid' : ''}`}
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    if (errores.password) setErrores(prev => ({ ...prev, password: '' }));
                                }}
                                placeholder="Entre 4 y 10 caracteres"
                                style={{ backgroundColor: 'var(--bg-body)', border: '1px solid var(--border-subtle)', color: 'var(--text-main)' }}
                            />
                        </CampoFormulario>

                        <button type="submit" className="btn btn-hero-gold w-100 mb-3 fw-bold">
                            Ingresar
                        </button>

                        <div className="text-center mt-3">
                            <span className="small text-secondary">¿No tienes cuenta? </span>
                            <Link to="/registro" className="small text-gold fw-bold text-decoration-none">
                                Regístrate aquí
                            </Link>
                        </div>
                    </form>

                    {/* Accesos rápidos para evaluación */}
                    <div className="mt-4 pt-3 border-top-subtle text-center">
                        <p className="small text-secondary mb-2">
                            ⚡ Accesos rápidos para probar roles:
                        </p>
                        <div className="d-flex flex-wrap gap-2 justify-content-center">
                            <button
                                type="button"
                                onClick={() => loginRapido('admin')}
                                className="btn btn-sm btn-outline-warning"
                            >
                                Admin
                            </button>
                            <button
                                type="button"
                                onClick={() => loginRapido('vendedor')}
                                className="btn btn-sm btn-outline-info"
                            >
                                Vendedor
                            </button>
                            <button
                                type="button"
                                onClick={() => loginRapido('cliente')}
                                className="btn btn-sm btn-outline-light"
                            >
                                Cliente
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}