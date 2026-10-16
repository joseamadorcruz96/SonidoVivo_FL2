import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Producto } from '../../components/Producto';
import { useCarrito } from '../../Context/CarritoContext';
import { cargarProductosDesdeLocalStorage } from './Catalogo';

export function Inicio() {
    const [productos] = useState(cargarProductosDesdeLocalStorage);
    const { agregarAlCarrito } = useCarrito();
    const destacados = productos.filter(producto => producto.destacado).slice(0, 4);

    return (
        <>
        <section 
            className="d-flex align-items-center justify-content-center text-center" 
            style={{ 
                minHeight: '60vh',
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
                        className="btn btn-lg fw-bold px-4 py-3 shadow-sm d-flex align-items-center justify-content-center"
                        style={{ backgroundColor: 'var(--color-gold)', color: '#000', borderRadius: '8px', width: '290px', maxWidth: '100%' }}
                    >
                        🎸 Explorar Catálogo
                    </Link>
                    
                    <Link 
                        to="/login" 
                        className="btn btn-lg btn-outline-light px-4 py-3 d-flex align-items-center justify-content-center"
                        style={{ borderRadius: '8px', width: '290px', maxWidth: '100%' }}
                    >
                        Iniciar Sesión
                    </Link>
                </div>

                {/* Decoración sutil de estadísticas o info rápida */}
                <div className="row mt-5 text-secondary mx-auto" style={{ maxWidth: '800px' }}>
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

        <section className="py-5 bg-surface-alt" aria-labelledby="titulo-destacados">
            <div className="container">
                <div className="text-center mb-4">
                    <span className="badge-hero-pill mb-3">Descubre tu próximo instrumento</span>
                    <h2 id="titulo-destacados" className="h2 fw-bold">
                        Instrumentos <span className="text-gold">Destacados</span>
                    </h2>
                    <p className="text-secondary mb-0">
                        Una selección de nuestro catálogo para acompañarte en tu próxima canción.
                    </p>
                </div>

                <div className="row g-4">
                    {destacados.map(producto => (
                        <div key={producto.codigo} className="col-12 col-md-6 col-lg-3 d-flex">
                            <Producto producto={producto} onAgregarAlCarrito={agregarAlCarrito} />
                        </div>
                    ))}
                </div>

                {destacados.length === 0 && (
                    <p className="text-center text-secondary">
                        Explora el catálogo para conocer nuestros instrumentos y accesorios disponibles.
                    </p>
                )}

                <div className="text-center mt-4">
                    <Link to="/catalogo" className="btn btn-hero-outline">
                        Ver todo el catálogo &rarr;
                    </Link>
                </div>
            </div>
        </section>

        <section className="py-5" aria-labelledby="titulo-beneficios">
            <div className="container">
                <h2 id="titulo-beneficios" className="h2 fw-bold text-center mb-4">
                    Más que una tienda de <span className="text-gold">instrumentos</span>
                </h2>

                <div className="row g-4">
                    <div className="col-12 col-md-4">
                        <article className="h-100 bg-surface-alt rounded-3 p-4">
                            <h3 className="h5 fw-bold text-gold">Asesoría para elegir</h3>
                            <p className="text-secondary mb-0">
                                ¿Estás comenzando o buscas un nuevo sonido? Te ayudamos a encontrar
                                el instrumento y los accesorios que necesitas.
                            </p>
                        </article>
                    </div>
                    <div className="col-12 col-md-4">
                        <article className="h-100 bg-surface-alt rounded-3 p-4">
                            <h3 className="h5 fw-bold text-gold">Servicio de luthería</h3>
                            <p className="text-secondary mb-0">
                                Dale a tu guitarra o bajo el cuidado que merece con nuestro
                                servicio de calibración, mantención y reparación.
                            </p>
                        </article>
                    </div>
                    <div className="col-12 col-md-4">
                        <article className="h-100 bg-surface-alt rounded-3 p-4">
                            <h3 className="h5 fw-bold text-gold">Desde Viña a todo Chile</h3>
                            <p className="text-secondary mb-0">
                                Visita nuestra tienda en Viña del Mar o consulta por el despacho
                                de tu próximo instrumento a tu región.
                            </p>
                        </article>
                    </div>
                </div>

                <div className="text-center mt-4">
                    <p className="text-secondary">Conversemos sobre tu próximo instrumento o el cuidado del que ya tienes.</p>
                    <Link to="/contacto" className="btn btn-hero-gold">Contactar a Sonido Vivo</Link>
                </div>
            </div>
        </section>
        </>
    );
}
