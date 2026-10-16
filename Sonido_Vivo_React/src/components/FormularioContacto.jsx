import { useState } from 'react';
import { CampoFormulario } from './CampoFormulario';
import { useForm } from '../hooks/useForm';
import { validarEmail, validarTexto } from '../utils/validaciones';

const datosIniciales = {
    nombre: '',
    email: '',
    telefono: '',
    motivo: '',
    mensaje: '',
    terminos: false
};

export function FormularioContacto() {
    // Usamos el hook useForm: nos entrega los datos, errores, handleChange y resetForm
    const { datos, errores, setErrores, handleChange, resetForm } = useForm(datosIniciales);
    const [enviado, setEnviado] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();

        const nuevosErrores = {
            nombre: validarTexto(datos.nombre, 'El nombre', 100, 3),
            email: validarEmail(datos.email),
            motivo: !datos.motivo ? 'Selecciona un motivo de contacto' : '',
            mensaje: validarTexto(datos.mensaje, 'El mensaje', 500, 10),
            terminos: !datos.terminos ? 'Debes aceptar ser contactado' : ''
        };

        if (Object.values(nuevosErrores).some(Boolean)) {
            setErrores(nuevosErrores);
            return;
        }

        setEnviado(true);
        resetForm();
    };

    return (
        <div className="card bg-dark text-light p-4 p-md-5 rounded-3 shadow">
            <h2 className="h3 fw-bold text-gold mb-2">Envíanos un Mensaje</h2>
            <p className="text-secondary small mb-4">
                Completa el formulario con los detalles de tu consulta. Los campos con * son obligatorios.
            </p>

            {enviado && (
                <div className="alert alert-success py-2 mb-4" role="alert">
                    <strong>¡Mensaje enviado con éxito!</strong> Nos contactaremos a la brevedad.
                </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
                <div className="row">
                    <div className="col-md-6">
                        <CampoFormulario label="Nombre Completo" error={errores.nombre} obligatorio>
                            <input
                                name="nombre"
                                className="form-control"
                                value={datos.nombre}
                                onChange={handleChange}
                                placeholder="Ej: Matías Silva"
                            />
                        </CampoFormulario>
                    </div>

                    <div className="col-md-6">
                        <CampoFormulario label="Correo Electrónico" error={errores.email} obligatorio>
                            <input
                                name="email"
                                type="email"
                                className="form-control"
                                value={datos.email}
                                onChange={handleChange}
                                placeholder="@duoc.cl o @gmail.com"
                            />
                        </CampoFormulario>
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-6">
                        <CampoFormulario label="Teléfono / WhatsApp">
                            <input
                                name="telefono"
                                type="tel"
                                className="form-control"
                                value={datos.telefono}
                                onChange={handleChange}
                                placeholder="+56 9 1234 5678"
                            />
                        </CampoFormulario>
                    </div>

                    <div className="col-md-6">
                        <CampoFormulario label="Tipo de Consulta" error={errores.motivo} obligatorio>
                            <select
                                name="motivo"
                                className="form-select"
                                value={datos.motivo}
                                onChange={handleChange}
                            >
                                <option value="">Selecciona una opción...</option>
                                <option value="lutheria">Servicio de Luthería / Calibración</option>
                                <option value="cotizacion">Cotización de Instrumento o Equipo</option>
                                <option value="despacho">Estado de Despacho / Pedido</option>
                                <option value="general">Consulta General</option>
                            </select>
                        </CampoFormulario>
                    </div>
                </div>

                <CampoFormulario label="Mensaje" error={errores.mensaje} obligatorio>
                    <textarea
                        name="mensaje"
                        rows="4"
                        className="form-control"
                        value={datos.mensaje}
                        onChange={handleChange}
                        placeholder="Cuéntanos más detalles de tu consulta..."
                    />
                </CampoFormulario>

                <div className="form-check mb-3">
                    <input
                        id="terminos"
                        name="terminos"
                        type="checkbox"
                        className="form-check-input"
                        checked={datos.terminos}
                        onChange={handleChange}
                    />
                    <label htmlFor="terminos" className="form-check-label text-secondary small">
                        Acepto ser contactado por el equipo técnico de Sonido Vivo *
                    </label>
                    {errores.terminos && (
                        <div className="text-danger small mt-1">⚠ {errores.terminos}</div>
                    )}
                </div>

                <button type="submit" className="btn btn-hero-gold w-100 py-2 fw-bold">
                    Enviar Consulta
                </button>
            </form>
        </div>
    );
}