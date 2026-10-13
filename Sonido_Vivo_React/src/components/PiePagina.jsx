import { Link } from 'react-router-dom';

export function PiePagina() {
    return (
        <footer className="footer-sonido-vivo" id="contacto-footer">
            <div className="container">
                <div className="row g-4">
                    {/* Columna 1: Identidad y Trayectoria */}
                    <div className="col-12 col-md-4">
                        <h5>Sonido Vivo</h5>
                        <p className="small text-secondary">
                            Tienda especializada en instrumentos musicales, amplificación y servicio técnico de luthería en Viña del
                            Mar, Región de Valparaíso.
                        </p>
                        <span className="footer-badge-lutheria">11 Años de Trayectoria</span>
                    </div>

                    {/* Columna 2: Navegación Rápida */}
                    <div className="col-6 col-md-2">
                        <h5>Navegación</h5>
                        <ul>
                            <li><Link to="/">Inicio</Link></li>
                            <li><Link to="/Catalogo">Catálogo</Link></li>
                            <li><Link to="/Nosotros">Nosotros</Link></li>
                            <li><Link to="/Blogs">Noticias & Blogs</Link></li>
                            <li><Link to="/Contacto">Contacto</Link></li>
                        </ul>
                    </div>

                    {/* Columna 3: Categorías Musicales */}
                    <div className="col-6 col-md-3">
                        <h5>Instrumentos</h5>
                        <ul>
                            <li><Link to="/Catalogo">Guitarras Eléctricas & Acústicas</Link></li>
                            <li><Link to="/Catalogo">Bajos y Amplificadores</Link></li>
                            <li><Link to="/Catalogo">Teclados y Sintetizadores</Link></li>
                            <li><Link to="/Catalogo">Micrófonos y Audio en Vivo</Link></li>
                            <li><Link to="/Catalogo">Accesorios & Cuerdas</Link></li>
                        </ul>
                    </div>

                    {/* Columna 4: Ubicación y Horarios */}
                    <div className="col-12 col-md-3">
                        <h5>Tienda Física</h5>
                        <p className="small text-secondary mb-1">
                            📍 Av. Libertad #1024, Viña del Mar
                        </p>
                        <p className="small text-secondary mb-1">
                            🕒 Lunes a Sábado: 10:30 a 19:30 hrs
                        </p>
                        <p className="small text-secondary">
                            📦 Envíos a todo Chile vía Starken y Chilexpress
                        </p>
                    </div>
                </div>

                {/* Barra Inferior de Derechos */}
                <div className="footer-bottom">
                    <p className="mb-0 text-secondary">
                        &copy; 2026 Sonido Vivo - Todos los derechos reservados. Proyecto Académico DSY1104 Full Stack II.
                    </p>
                </div>
            </div>
        </footer>
    );
}
