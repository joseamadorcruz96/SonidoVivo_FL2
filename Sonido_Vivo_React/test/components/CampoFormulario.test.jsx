import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CampoFormulario } from '../../src/components/CampoFormulario';

describe('Pruebas unitarias en CampoFormulario', () => {

    it('Debe renderizar la etiqueta label con el asterisco cuando es obligatorio', () => {
        render(
            <CampoFormulario id="test-input" label="Nombre Completo" obligatorio={true}>
                <input id="test-input" />
            </CampoFormulario>
        );

        expect(screen.getByText(/Nombre Completo/)).toBeInTheDocument();
        expect(screen.getByText('*')).toBeInTheDocument();
    });

    it('Renderizado condicional: NO debe mostrar mensaje de error si la prop error es undefined', () => {
        render(
            <CampoFormulario id="test-input" label="Correo Electrónico">
                <input id="test-input" />
            </CampoFormulario>
        );

        expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });

    it('Renderizado condicional: Debe mostrar el mensaje de error cuando la prop error está presente', () => {
        const mensajeError = 'El campo correo es obligatorio';
        render(
            <CampoFormulario id="test-input" label="Correo Electrónico" error={mensajeError}>
                <input id="test-input" />
            </CampoFormulario>
        );

        const alerta = screen.getByRole('alert');
        expect(alerta).toBeInTheDocument();
        expect(alerta).toHaveTextContent(mensajeError);
    });

});
