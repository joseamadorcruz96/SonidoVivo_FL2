import { Link } from 'react-router-dom';

export function NotFound() {
    return (
        <section className="d-flex flex-column align-items-center justify-content-center text-center py-5" style={{ minHeight: '60vh' }}>
            <h1 className="fw-bold text-danger mb-3" style={{ fontSize: '5rem', fontFamily: 'var(--font-heading)' }}>404</h1>
            <h2 className="fw-bold mb-3" style={{ color: 'var(--color-gold)' }}>Página no encontrada</h2>
            <p className="text-secondary mb-4">Lo sentimos, la ruta que buscas no existe en nuestra tienda.</p>
            <Link to="/" className="btn btn-hero-gold">Volver al Inicio</Link>
        </section>
    );
}