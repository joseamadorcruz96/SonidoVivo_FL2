import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUsuario, usuariosDb } from '../services/db';
import { useAuth } from '../Context/AuthContext';

export function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    
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
        
        // Validamos contra db.js
        const usuario = loginUsuario(email, password);

        if (usuario) {
            setError('');
            autenticarYRedirigir(usuario);
        } else {
            setError('Correo o contraseña incorrectos.');
        }
    };

    // Accesos rápidos para facilitar pruebas de evaluación
    const loginRapido = (rolObjetivo) => {
        const usuarioDemo = usuariosDb.find(u => u.rol.toLowerCase() === rolObjetivo.toLowerCase());
        if (usuarioDemo) {
            setError('');
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

                    {error && (
                        <div className="alert alert-danger py-2 text-center" style={{ fontSize: '0.9rem' }}>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label fw-semibold" style={{ color: 'var(--text-main)' }}>Correo Electrónico</label>
                            <input
                                type="email"
                                className="form-control"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="ejemplo@correo.com"
                                required
                                style={{ backgroundColor: 'var(--bg-body)', border: '1px solid var(--border-subtle)', color: 'var(--text-main)' }}
                            />
                        </div>

                        <div className="mb-4">
                            <label className="form-label fw-semibold" style={{ color: 'var(--text-main)' }}>Contraseña</label>
                            <input
                                type="password"
                                className="form-control"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="******"
                                required
                                style={{ backgroundColor: 'var(--bg-body)', border: '1px solid var(--border-subtle)', color: 'var(--text-main)' }}
                            />
                        </div>

                        <button type="submit" className="btn btn-hero-gold w-100 mb-3 fw-bold">
                            Ingresar
                        </button>
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

                    <div className="text-center mt-3">
                        <Link to="/" className="text-secondary small">
                            &larr; Volver al Inicio
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}