import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUsuario } from '../services/db';

export function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault(); 
        
        // Llamamos a la función de db.js
        const usuario = loginUsuario(email, password);

        if (usuario) {
            setError('');
            
            // Redirigimos dependiendo del rol del usuario
            if (usuario.rol === 'admin') {
                // Redirigir al dashboard administrativo (según rúbrica)[cite: 23]
                window.location.href = '/admin'; 
            } else if (usuario.rol === 'vendedor') {
                window.location.href = '/vendedor';
            } else {
                window.location.href = '/'; // El cliente va al inicio
            }
        } else {
            setError('Correo o contraseña incorrectos.');
        }
    };

    return (
        <section className="d-flex align-items-center justify-content-center py-5" style={{ minHeight: '80vh' }}>
            <div className="card shadow-lg" style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', width: '100%', maxWidth: '400px', borderRadius: 'var(--radius-lg)' }}>
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

                        <button type="submit" className="btn btn-hero-gold w-100 mb-3">
                            Ingresar
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
}