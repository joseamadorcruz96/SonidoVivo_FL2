import { useState } from 'react';
import { validarEmail } from '../utils/validaciones';

const datosIniciales = {
    nombre: '',
    email: '',
    telefono: '',
    motivo: '',
    mensaje: '',
    terminos: false,
};

const campos = [
    {
        nombre: 'nombre',
        etiqueta: 'Nombre Completo',
        tipo: 'text',
        placeholder: 'Ej: Matías Silva',
        obligatorio: true,
    },
    {
        nombre: 'email',
        etiqueta: 'Correo Electrónico',
        tipo: 'email',
        placeholder: 'nombre@correo.cl',
        obligatorio: true,
    },
    {
        nombre: 'telefono',
        etiqueta: 'Teléfono / WhatsApp',
        tipo: 'tel',
        placeholder: '+56 9 1234 5678',
        obligatorio: false,
    },
];

export function FormularioContacto() {
    const [datos, setDatos] = useState(datosIniciales);
    const [errores, setErrores] = useState({});
    const [validado, setValidado] = useState(false);

    function actualizarCampo(event) {
        const { name, value, type, checked } = event.target;

        setDatos({
            ...datos,
            [name]: type === 'checkbox' ? checked : value,
        });

        setErrores({
            ...errores,
            [name]: '',
        });

        setValidado(false);
    }

    function manejarEnvio(event) {
        event.preventDefault();

        const nuevosErrores = {};
        const telefono = datos.telefono.replace(/\s/g, '');

        if (datos.nombre.trim().length < 3) {
            nuevosErrores.nombre = 'Ingresa tu nombre (mínimo 3 caracteres).';
        }

        const errorEmail = validarEmail(datos.email);
        if (errorEmail) {
            nuevosErrores.email = errorEmail;
        }

        if (telefono && !/^(\+?56)?9[0-9]{8}$/.test(telefono)) {
            nuevosErrores.telefono =
                'Formato inválido. Ejemplo: +56912345678 o 912345678.';
        }

        if (!datos.motivo) {
            nuevosErrores.motivo = 'Selecciona un motivo de contacto.';
        }

        if (datos.mensaje.trim().length < 10) {
            nuevosErrores.mensaje =
                'El mensaje debe contener al menos 10 caracteres.';
        }

        if (!datos.terminos) {
            nuevosErrores.terminos = 'Debes aceptar ser contactado.';
        }

        const esValido = Object.keys(nuevosErrores).length === 0;

        setErrores(nuevosErrores);
        setValidado(esValido);

        if (esValido) {
            setDatos(datosIniciales);
        }
    }

    const tieneErrores = Object.values(errores).some(Boolean);

    return (
        <div className="card-contacto p-4 p-md-5 rounded-3 shadow-lg">
            <h2 className="h3 fw-bold text-gold mb-2">Envíanos un Mensaje</h2>

            <p className="text-secondary small mb-4">
                Completa el formulario con los detalles de tu consulta.
                Los campos con * son obligatorios.
            </p>

            {tieneErrores && (
                <div className="alert alert-danger" role="alert">
                    Por favor corrige los campos indicados en rojo.
                </div>
            )}

            {validado && (
                <div className="alert alert-success" role="status">
                    <strong>¡Mensaje enviado con éxito!</strong> Tu consulta fue recibida
                    por nuestro equipo técnico. Te responderemos a la brevedad.
                </div>
            )}

            <form onSubmit={manejarEnvio} noValidate>
                <div className="row g-3">
                    {campos.map((campo) => (
                        <div className="col-12 col-md-6" key={campo.nombre}>
                            <label
                                htmlFor={`contacto-${campo.nombre}`}
                                className="form-label text-light fw-medium"
                            >
                                {campo.etiqueta}
                                {campo.obligatorio && <span className="text-gold"> *</span>}
                            </label>

                            <input
                                id={`contacto-${campo.nombre}`}
                                name={campo.nombre}
                                type={campo.tipo}
                                className={`form-control input-contacto-custom ${errores[campo.nombre] ? 'is-invalid' : ''
                                    }`}
                                placeholder={campo.placeholder}
                                value={datos[campo.nombre]}
                                onChange={actualizarCampo}
                                required={campo.obligatorio}
                                aria-invalid={Boolean(errores[campo.nombre])}
                                aria-describedby={
                                    errores[campo.nombre] ? `error-${campo.nombre}` : undefined
                                }
                            />

                            {errores[campo.nombre] && (
                                <div
                                    className="invalid-feedback"
                                    id={`error-${campo.nombre}`}
                                >
                                    {errores[campo.nombre]}
                                </div>
                            )}
                        </div>
                    ))}

                    <div className="col-12 col-md-6">
                        <label
                            htmlFor="contacto-motivo"
                            className="form-label text-light fw-medium"
                        >
                            Tipo de Consulta <span className="text-gold">*</span>
                        </label>

                        <select
                            id="contacto-motivo"
                            name="motivo"
                            className={`form-select input-contacto-custom ${errores.motivo ? 'is-invalid' : ''
                                }`}
                            value={datos.motivo}
                            onChange={actualizarCampo}
                            required
                            aria-invalid={Boolean(errores.motivo)}
                            aria-describedby={errores.motivo ? 'error-motivo' : undefined}
                        >
                            <option value="" disabled>Selecciona una opción...</option>
                            <option value="lutheria">
                                Servicio de Luthería / Calibración
                            </option>
                            <option value="cotizacion">
                                Cotización de Instrumento o Equipo
                            </option>
                            <option value="despacho">Estado de Despacho / Pedido</option>
                            <option value="general">Consulta General</option>
                        </select>

                        {errores.motivo && (
                            <div className="invalid-feedback" id="error-motivo">
                                {errores.motivo}
                            </div>
                        )}
                    </div>

                    <div className="col-12">
                        <label
                            htmlFor="contacto-mensaje"
                            className="form-label text-light fw-medium"
                        >
                            Mensaje / Detalle del Instrumento{' '}
                            <span className="text-gold">*</span>
                        </label>

                        <textarea
                            id="contacto-mensaje"
                            name="mensaje"
                            rows="5"
                            className={`form-control input-contacto-custom ${errores.mensaje ? 'is-invalid' : ''
                                }`}
                            placeholder="Cuéntanos más detalles de tu consulta o el modelo de tu instrumento..."
                            value={datos.mensaje}
                            onChange={actualizarCampo}
                            required
                            aria-invalid={Boolean(errores.mensaje)}
                            aria-describedby={errores.mensaje ? 'error-mensaje' : undefined}
                        />

                        {errores.mensaje && (
                            <div className="invalid-feedback" id="error-mensaje">
                                {errores.mensaje}
                            </div>
                        )}
                    </div>

                    <div className="col-12">
                        <div className="form-check">
                            <input
                                id="contacto-terminos"
                                name="terminos"
                                type="checkbox"
                                className={`form-check-input check-gold ${errores.terminos ? 'is-invalid' : ''
                                    }`}
                                checked={datos.terminos}
                                onChange={actualizarCampo}
                                required
                                aria-invalid={Boolean(errores.terminos)}
                                aria-describedby={
                                    errores.terminos ? 'error-terminos' : undefined
                                }
                            />

                            <label
                                htmlFor="contacto-terminos"
                                className="form-check-label text-secondary small"
                            >
                                Acepto ser contactado por el equipo técnico de Sonido Vivo{' '}
                                <span className="text-gold">*</span>
                            </label>

                            {errores.terminos && (
                                <div className="invalid-feedback" id="error-terminos">
                                    {errores.terminos}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="col-12 pt-2">
                        <button
                            type="submit"
                            className="btn btn-hero-gold w-100 py-2 fw-bold"
                        >
                            Enviar Consulta
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}