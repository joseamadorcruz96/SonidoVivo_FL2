import { Link } from 'react-router-dom';

export function Inicio() {
    return (
        <section 
            className="d-flex align-items-center justify-content-center text-center" 
            style={{ 
                minHeight: '75vh', 
                backgroundColor: 'var(--bg-body)',
                padding: '40px 20px'
            }}
        >
            <div className="container">
                <h1 className="display-3 fw-bold text-light mb-3">
                    Bienvenido a <span style={{ color: 'var(--color-gold)' }}>Sonido Vivo</span>
                </h1>
                
                <p className="lead text-secondary mx-auto mb-5" style={{ maxWidth: '700px', fontSize: '1.2rem' }}>
                    Tu tienda especializada en instrumentos musicales, amplificación y servicio técnico de luthería en Viña del Mar. Aquí encontrarás las mejores novedades y ofertas del mercado.
                </p>

                <div className="d-flex justify-content-center gap-3 flex-wrap">
                    <Link 
                        to="/catalogo" 
                        className="btn btn-lg fw-bold px-5 py-3 shadow-sm" 
                        style={{ backgroundColor: 'var(--color-gold)', color: '#000', borderRadius: '8px' }}
                    >
                        🎸 Explorar Catálogo
                    </Link>
                    
                    <Link 
                        to="/login" 
                        className="btn btn-lg btn-outline-light px-5 py-3"
                        style={{ borderRadius: '8px' }}
                    >
                        Iniciar Sesión
                    </Link>
                </div>

                {/* Decoración sutil de estadísticas o info rápida */}
                <div className="row mt-5 pt-5 text-secondary mx-auto" style={{ maxWidth: '800px' }}>
                    <div className="col-md-4 mb-3">
                        <h3 className="fw-bold text-light">+300</h3>
                        <span>Instrumentos</span>
                    </div>
                    <div className="col-md-4 mb-3">
                        <h3 className="fw-bold text-light">11 Años</h3>
                        <span>De Trayectoria</span>
                    </div>
                    <div className="col-md-4 mb-3">
                        <h3 className="fw-bold text-light">Envíos</h3>
                        <span>A todo Chile</span>
                    </div>
                </div>
            </div>
        </section>
    );
}