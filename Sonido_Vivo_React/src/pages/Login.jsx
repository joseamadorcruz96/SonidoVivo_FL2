import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUsuario, usuariosDb } from '../services/db';
import { useAuth } from '../Context/AuthContext';
import { CampoFormulario } from '../components/CampoFormulario';
import { validarEmail, validarPassword } from '../utils/validaciones';

export function Login() {
    const navigate = useNavigate();
    const { iniciarSesion } = useAuth();

    // 1. Estado simple del formulario
    const [form, setForm] = useState({ email: '', password: '' });
    const [errores, setErrores] = useState({});
    const [errorGeneral, setErrorGeneral] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
        if (errores[name]) setErrores(prev => ({ ...prev, [name]: '' }));
    };

    const autenticar = (usuario) => {
        iniciarSesion(usuario);
        const rol = (usuario.rol || '').toLowerCase();
        navigate(rol === 'vendedor' ? '/vendedor' : rol === 'cliente' ? '/' : '/admin');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrorGeneral('');

        // Validamos usando las utilidades centralizadas
        const nuevosErrores = {
            email: validarEmail(form.email),
            password: validarPassword(form.password)
        };

        if (Object.values(nuevosErrores).some(Boolean)) {
            setErrores(nuevosErrores);
            return;
        }

        const usuario = loginUsuario(form.email, form.password);
        if (usuario) {
            autenticar(usuario);
        } else {
            setErrorGeneral('Correo o contraseña incorrectos.');
        }
    };

    return (
        <section className="d-flex align-items-center justify-content-center py-5">
            <div className="card bg-dark text-light p-4 shadow" style={{ width: '100%', maxWidth: '420px' }}>
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
                            value={form.email}
                            onChange={handleChange}
                            placeholder="ejemplo@gmail.com / @duoc.cl"
                        />
                    </CampoFormulario>

                    <CampoFormulario label="Contraseña" error={errores.password} obligatorio>
                        <input
                            name="password"
                            type="password"
                            className="form-control"
                            value={form.password}
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
            </div>
        </section>
    );
}