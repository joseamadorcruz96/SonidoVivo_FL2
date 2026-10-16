import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUsuario, usuariosDb } from '../services/db';
import { useAuth } from '../Context/AuthContext';
import { CampoFormulario } from '../components/CampoFormulario';
import { useForm } from '../hooks/useForm';
import { validarEmail, validarPassword } from '../utils/validaciones';
import logo from '../assets/logo.svg';

export function Login() {
    const navigate = useNavigate();
    const { iniciarSesion } = useAuth();

    // Usamos el hook useForm
    const { datos, errores, setErrores, handleChange } = useForm({ email: '', password: '' });
    const [errorGeneral, setErrorGeneral] = useState('');

    const autenticar = (usuario) => {
        iniciarSesion(usuario);
        const rol = (usuario.rol || '').toLowerCase();
        navigate(rol === 'vendedor' ? '/vendedor' : rol === 'cliente' ? '/' : '/admin');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrorGeneral('');

        const nuevosErrores = {
            email: validarEmail(datos.email),
            password: validarPassword(datos.password)
        };

        if (Object.values(nuevosErrores).some(Boolean)) {
            setErrores(nuevosErrores);
            return;
        }

        const usuario = loginUsuario(datos.email, datos.password);
        if (usuario) {
            autenticar(usuario);
        } else {
            setErrorGeneral('Correo o contraseña incorrectos.');
        }
    };

    return (
        <section className="d-flex align-items-center justify-content-center py-5">
            <div className="card bg-dark text-light p-4 shadow" style={{ width: '100%', maxWidth: '420px' }}>
                <div className="text-center mb-3">
                    <img src={logo} alt="Sonido Vivo" style={{ height: '48px' }} className="mb-2" />
                    <h1 className="h4 fw-bold text-light mb-0">Sonido <span className="text-gold">Vivo</span></h1>
                </div>
                <h2 className="text-center fw-bold text-gold mb-1">Iniciar Sesión</h2>
                <p className="text-center text-secondary small mb-4">Ingresa a tu cuenta de Sonido Vivo</p>

                {errorGeneral && (
                    <div className="alert alert-danger py-2 text-center small">{errorGeneral}</div>
                )}

                <form onSubmit={handleSubmit} noValidate>
                    <CampoFormulario label="Correo Electrónico" error={errores.email} obligatorio>
                        <input
                            name="email"
                            type="email"
                            className="form-control"
                            value={datos.email}
                            onChange={handleChange}
                            placeholder="ejemplo@gmail.com / @duoc.cl"
                        />
                    </CampoFormulario>

                    <CampoFormulario label="Contraseña" error={errores.password} obligatorio>
                        <input
                            name="password"
                            type="password"
                            className="form-control"
                            value={datos.password}
                            onChange={handleChange}
                            placeholder="Entre 4 y 10 caracteres"
                        />
                    </CampoFormulario>

                    <button type="submit" className="btn btn-hero-gold w-100 fw-bold mt-2">
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
                <div className="mt-4 pt-3 border-top border-secondary text-center">
                    <p className="small text-secondary mb-2">⚡ Probar roles rápidos:</p>
                    <div className="d-flex gap-2 justify-content-center">
                        {['admin', 'vendedor', 'cliente'].map(rol => (
                            <button
                                key={rol}
                                type="button"
                                onClick={() => {
                                    const u = usuariosDb.find(user => user.rol.toLowerCase() === rol);
                                    if (u) autenticar(u);
                                }}
                                className="btn btn-sm btn-outline-warning text-capitalize"
                            >
                                {rol}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}