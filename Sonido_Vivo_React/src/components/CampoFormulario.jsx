/**
 * ============================================================================
 * COMPONENTE ENVOLTORIO: CampoFormulario
 * Archivo: src/components/CampoFormulario.jsx
 * ============================================================================
 * Componente que anida hijos (children) para estandarizar etiquetas (labels),
 * marcas de obligatoriedad (*) y mensajes de error en cualquier formulario.
 */

export function CampoFormulario({ label, error, obligatorio = false, id, children }) {
    return (
        <div className="mb-3 text-start">
            {label && (
                <label htmlFor={id} className="form-label fw-semibold text-light mb-1">
                    {label} {obligatorio && <span className="text-warning">*</span>}
                </label>
            )}

            {/* Aquí se inyecta el input, select o textarea enviado como hijo */}
            {children}

            {/* Mensaje de error dinámico */}
            {error && (
                <div className="text-danger small mt-1" role="alert">
                    ⚠ {error}
                </div>
            )}
        </div>
    );
}
