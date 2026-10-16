import { useState } from 'react';
import { FormularioContacto } from '../../components/FormularioContacto';

const preguntas = [
    {
        id: 'calibracion',
        titulo: '🛠️ ¿Cuánto tiempo tarda la calibración de una guitarra o bajo?',
        respuesta:
            'El plazo estándar para calibración y mantención general es de 24 a 48 horas hábiles. Si requiere trabajos más complejos de electrónica o cambio de trastes, el plazo se acuerda previa revisión técnica en taller.',
    },
    {
        id: 'envios',
        titulo: '📦 ¿Hacen envíos a todo Chile y cómo protegen los instrumentos?',
        respuesta:
            'Sí, enviamos a todas las regiones de Chile mediante Starken y Chilexpress. Todos los instrumentos son embalados en doble caja de alto impacto con relleno de protección y seguro contra imprevistos en ruta.',
    },
    {
        id: 'pagos',
        titulo: '💳 ¿Qué medios de pago aceptan en tienda y sitio web?',
        respuesta:
            'Aceptamos tarjetas de débito y crédito (Webpay Plus), transferencias electrónicas directas y pago presencial en tienda. Ofrecemos hasta 6 cuotas sin interés con bancos seleccionados.',
    },
];

export function Contacto() {
    const [preguntaAbierta, setPreguntaAbierta] = useState(null);

    return (
        <div id="contacto-main">
            <section className="hero-contacto text-center py-5">
                <div className="container py-3">
                    <span className="badge-hero-pill mb-3">
                        Atención al Cliente &amp; Servicio Técnico
                    </span>

                    <h1 className="display-4 fw-bold hero-titulo mb-3">
                        ¿En qué podemos <span className="text-gold">ayudarte?</span>
                    </h1>

                    <p
                        className="lead text-secondary mx-auto mb-0"
                        style={{ maxWidth: '720px' }}
                    >
                        Contáctanos para cotizaciones de productos, presupuestos de
                        luthería, calibraciones de instrumentos o consultas sobre
                        tus pedidos.
                    </p>
                </div>
            </section>

            <section className="py-5">
                <div className="container">
                    <div className="row g-5">
                        <div className="col-12 col-lg-7">
                            <FormularioContacto />
                        </div>

                        <div className="col-12 col-lg-5">
                            <div className="d-flex flex-column gap-4">
                                <article className="info-card-contacto p-4 rounded-3">
                                    <div className="d-flex align-items-start gap-3">
                                        <div className="info-icon-wrapper">📍</div>
                                        <div>
                                            <h3 className="h5 fw-bold text-light mb-1">
                                                Tienda Física &amp; Taller
                                            </h3>
                                            <p className="text-secondary small mb-1">
                                                Av. Libertad #1024, Viña del Mar,
                                                Región de Valparaíso.
                                            </p>
                                            <span className="badge-lutheria-sm">
                                                Retiro en tienda disponible
                                            </span>
                                        </div>
                                    </div>
                                </article>

                                <article className="info-card-contacto p-4 rounded-3">
                                    <div className="d-flex align-items-start gap-3">
                                        <div className="info-icon-wrapper">🕒</div>
                                        <div>
                                            <h3 className="h5 fw-bold text-light mb-1">
                                                Horario de Atención
                                            </h3>
                                            <p className="text-secondary small mb-1">
                                                <strong>Lunes a Viernes:</strong> 10:30 - 19:30 hrs
                                            </p>
                                            <p className="text-secondary small mb-0">
                                                <strong>Sábados:</strong> 11:00 - 18:00 hrs
                                            </p>
                                        </div>
                                    </div>
                                </article>

                                <article className="info-card-contacto p-4 rounded-3">
                                    <div className="d-flex align-items-start gap-3">
                                        <div className="info-icon-wrapper">💬</div>
                                        <div>
                                            <h3 className="h5 fw-bold text-light mb-1">
                                                Atención Directa
                                            </h3>
                                            <p className="text-secondary small mb-1">
                                                <strong>WhatsApp Luthería:</strong> +56 9 8765 4321
                                            </p>
                                            <p className="text-secondary small mb-0">
                                                <strong>Ventas &amp; Email:</strong>{' '}
                                                contacto@sonidovivo.cl
                                            </p>
                                        </div>
                                    </div>
                                </article>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-5 bg-surface-alt">
                <div className="container">
                    <div className="text-center mb-5">
                        <h2 className="h3 fw-bold text-gold">Preguntas Frecuentes</h2>
                        <p className="text-secondary">
                            Resolvemos tus dudas sobre servicios, garantías y despachos
                        </p>
                    </div>

                    <div className="row justify-content-center">
                        <div className="col-12 col-lg-8">
                            <div className="accordion accordion-custom">
                                {preguntas.map((pregunta) => {
                                    const abierta = preguntaAbierta === pregunta.id;

                                    return (
                                        <div
                                            key={pregunta.id}
                                            className="accordion-item bg-surface border-subtle mb-3 rounded overflow-hidden"
                                        >
                                            <h3 className="accordion-header">
                                                <button
                                                    id={`pregunta-${pregunta.id}`}
                                                    type="button"
                                                    className={`accordion-button bg-surface text-light ${abierta ? '' : 'collapsed'
                                                        }`}
                                                    aria-expanded={abierta}
                                                    aria-controls={`respuesta-${pregunta.id}`}
                                                    onClick={() =>
                                                        setPreguntaAbierta(abierta ? null : pregunta.id)
                                                    }
                                                >
                                                    {pregunta.titulo}
                                                </button>
                                            </h3>

                                            <div
                                                id={`respuesta-${pregunta.id}`}
                                                className={`accordion-collapse collapse ${abierta ? 'show' : ''
                                                    }`}
                                                aria-labelledby={`pregunta-${pregunta.id}`}
                                            >
                                                <div className="accordion-body text-secondary small border-top-subtle">
                                                    {pregunta.respuesta}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}