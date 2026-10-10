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
        </div>
      </section>
    </div>
  );
}