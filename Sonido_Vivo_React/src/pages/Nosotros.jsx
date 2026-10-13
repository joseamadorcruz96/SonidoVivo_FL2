import { Link } from 'react-router-dom';

export function Nosotros() {
    return (
        <div id="nosotros-main">
            <section className="hero-nosotros text-center py-5">
                <div className="container py-3">
                    <span className="badge-hero-pill mb-3">
                        11 Años de Pasión Musical
                    </span>

                    <h1 className="display-4 fw-bold hero-titulo mb-3">
                        Nuestra Historia en <span className="text-gold">Viña del Mar</span>
                    </h1>

                    <p
                        className="lead text-secondary mx-auto mb-0"
                        style={{ maxWidth: '750px' }}
                    >
                        Desde 2015, Sonido Vivo ha crecido como la tienda boutique y taller
                        de luthería de confianza para músicos, bandas e instituciones de
                        toda la Región de Valparaíso y Chile.
                    </p>
                </div>
            </section>
            <section className="py-5 border-bottom-subtle">
                <div className="container">
                    <div className="row g-4 align-items-center mb-5">
                        <div className="col-12 col-lg-6">
                            <article className="nosotros-card p-4 rounded-3">
                                <h2 className="h3 fw-bold text-gold mb-3">
                                    De la Pasión al Escenario
                                </h2>

                                <p className="text-secondary mb-3">
                                    Fundada por músicos locales en la Región de Valparaíso,
                                    Sonido Vivo nació con la misión de brindar un asesoramiento
                                    técnico real. Entendemos que cada instrumento tiene un alma
                                    y una afinación única.
                                </p>

                                <p className="text-secondary mb-0">
                                    A lo largo de más de una década, hemos mantenido nuestro
                                    compromiso: ofrecer equipos probados y calibrados
                                    personalmente por nuestro equipo antes de llegar a tus manos.
                                </p>
                            </article>
                        </div>

                        <div className="col-12 col-lg-6 text-center">
                            <img
                                src="https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80"
                                alt="Taller de Luthería Sonido Vivo"
                                className="img-fluid rounded-3 shadow-lg border-gold-soft"
                            />
                        </div>
                    </div>
                    <div className="row g-4">
                        <div className="col-12 col-md-4">
                            <article className="nosotros-pillar-card p-4 h-100">
                                <div className="pillar-icon mb-3">🎸</div>
                                <h3 className="h5 fw-bold mb-2">Catálogo Calibrado</h3>
                                <p className="small text-secondary mb-0">
                                    Más de 340 referencias seleccionadas cuidadosamente: guitarras,
                                    bajos, sintetizadores y audio profesional de marcas reconocidas.
                                </p>
                            </article>
                        </div>

                        <div className="col-12 col-md-4">
                            <article className="nosotros-pillar-card p-4 h-100">
                                <div className="pillar-icon mb-3">🛠️</div>
                                <h3 className="h5 fw-bold mb-2">Servicio de Luthería</h3>
                                <p className="small text-secondary mb-0">
                                    Taller especializado en ajuste de octavación, calibración de acción,
                                    reparación de circuitos y restauración de instrumentos de cuerda.
                                </p>
                            </article>
                        </div>

                        <div className="col-12 col-md-4">
                            <article className="nosotros-pillar-card p-4 h-100">
                                <div className="pillar-icon mb-3">📦</div>
                                <h3 className="h5 fw-bold mb-2">Envíos a todo Chile</h3>
                                <p className="small text-secondary mb-0">
                                    Embalaje reforzado y envíos garantizados vía Starken y Chilexpress
                                    para que tu instrumento llegue listo para sonar.
                                </p>
                            </article>
                        </div>
                    </div>
                </div>
            </section>
            <section className="py-5 bg-surface-alt">
                <div className="container text-center">
                    <h2 className="h3 fw-bold mb-4">Sonido Vivo en Cifras</h2>

                    <div className="row g-4">
                        <div className="col-6 col-md-3">
                            <div className="stat-box p-3">
                                <span className="stat-number text-gold">11+</span>
                                <p className="stat-label text-secondary mb-0">
                                    Años de Trayectoria
                                </p>
                            </div>
                        </div>

                        <div className="col-6 col-md-3">
                            <div className="stat-box p-3">
                                <span className="stat-number text-gold">340+</span>
                                <p className="stat-label text-secondary mb-0">
                                    Productos en Catálogo
                                </p>
                            </div>
                        </div>

                        <div className="col-6 col-md-3">
                            <div className="stat-box p-3">
                                <span className="stat-number text-gold">1500+</span>
                                <p className="stat-label text-secondary mb-0">
                                    Calibraciones Realizadas
                                </p>
                            </div>
                        </div>

                        <div className="col-6 col-md-3">
                            <div className="stat-box p-3">
                                <span className="stat-number text-gold">100%</span>
                                <p className="stat-label text-secondary mb-0">
                                    Comunas Atendidas
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className="py-5">
                <div className="container">
                    <div className="text-center mb-5">
                        <h2 className="h3 fw-bold hero-titulo">
                            El Equipo Detrás del Sonido
                        </h2>
                        <p className="text-secondary">
                            Atención personalizada por músicos para músicos
                        </p>
                    </div>

                    <div className="row g-4 justify-content-center">
                        <div className="col-12 col-md-4">
                            <article className="card-equipo p-4 text-center">
                                <div className="avatar-wrapper mb-3">
                                    <span className="avatar-placeholder">👨‍💼</span>
                                </div>
                                <h3 className="h5 fw-bold mb-1">Fundador &amp; Director</h3>
                                <p className="text-gold small mb-2">Dueño de Tienda</p>
                                <p className="small text-secondary mb-0">
                                    Encargado de la selección de proveedores globales, gestión
                                    del catálogo y control de calidad técnico.
                                </p>
                            </article>
                        </div>

                        <div className="col-12 col-md-4">
                            <article className="card-equipo p-4 text-center">
                                <div className="avatar-wrapper mb-3">
                                    <span className="avatar-placeholder">🎸</span>
                                </div>
                                <h3 className="h5 fw-bold mb-1">Especialista en Guitarras</h3>
                                <p className="text-gold small mb-2">Vendedor / Luthier</p>
                                <p className="small text-secondary mb-0">
                                    Experto en amplificación analógica, pedales de efecto y
                                    calibración fina de guitarras eléctricas y bajos.
                                </p>
                            </article>
                        </div>

                        <div className="col-12 col-md-4">
                            <article className="card-equipo p-4 text-center">
                                <div className="avatar-wrapper mb-3">
                                    <span className="avatar-placeholder">🎹</span>
                                </div>
                                <h3 className="h5 fw-bold mb-1">
                                    Especialista en Audio &amp; Teclados
                                </h3>
                                <p className="text-gold small mb-2">Vendedor / Asesor</p>
                                <p className="small text-secondary mb-0">
                                    Encargado del área de sintetizadores, interfaces de grabación,
                                    micrófonos y atención a pedidos regionales.
                                </p>
                            </article>
                        </div>
                    </div>
                </div>
            </section>
            <section className="py-5 bg-surface-alt">
                <div className="container">
                    <div className="row align-items-center g-4">
                        <div className="col-12 col-lg-5">
                            <h2 className="h3 fw-bold text-gold mb-3">
                                Conoce Nuestro Taller de Luthería
                            </h2>
                            <p className="text-secondary mb-3">
                                Descubre el proceso artesanal de mantenimiento, ajuste de trastes
                                y entonación que realizamos a cada instrumento antes de ser
                                exhibido o despachado.
                            </p>
                            <Link to="/contacto" className="btn btn-hero-gold">
                                Agendar Servicio Técnico
                            </Link>
                        </div>

                        <div className="col-12 col-lg-7">
                            <div className="ratio ratio-16x9 rounded-3 overflow-hidden shadow-lg border-gold-soft">
                                <iframe
                                    src="https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ"
                                    title="Proceso de Luthería en Sonido Vivo"
                                    allowFullScreen
                                ></iframe>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className="py-5">
                <div className="container">
                    <div className="text-center mb-4">
                        <h2 className="h3 fw-bold">Visítanos en Viña del Mar</h2>
                        <p className="text-secondary mb-1">
                            📍 Av. Libertad #1024, Viña del Mar, Región de Valparaíso
                        </p>
                        <p className="small text-gold">
                            Horario: Lunes a Sábado de 10:30 a 19:30 hrs
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}