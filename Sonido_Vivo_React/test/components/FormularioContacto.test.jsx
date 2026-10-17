import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FormularioContacto } from '../../src/components/FormularioContacto';

describe('Formulario de contacto', () => {
    it('muestra los errores al enviar el formulario vacío', async () => {
        const usuario = userEvent.setup();
        render(<FormularioContacto />);

        await usuario.click(screen.getByRole('button', { name: 'Enviar Consulta' }));

        expect(screen.getByText(/El nombre es obligatorio/)).toBeInTheDocument();
        expect(screen.getByText(/El correo electrónico es obligatorio/)).toBeInTheDocument();
        expect(screen.getByText(/Selecciona un motivo de contacto/)).toBeInTheDocument();
        expect(screen.getByText(/El mensaje es obligatorio/)).toBeInTheDocument();
        expect(screen.getByText(/Debes aceptar ser contactado/)).toBeInTheDocument();
        expect(screen.queryByText('¡Mensaje enviado con éxito!')).not.toBeInTheDocument();
    });

    it('confirma el envío simulado y limpia los campos con datos válidos', async () => {
        const usuario = userEvent.setup();
        render(<FormularioContacto />);

        // Usamos los placeholders porque estos campos todavía no tienen id asociado a su label.
        const nombre = screen.getByPlaceholderText('Ej: Matías Silva');
        const correo = screen.getByPlaceholderText('@duoc.cl o @gmail.com');
        const mensaje = screen.getByPlaceholderText('Cuéntanos más detalles de tu consulta...');
        const motivo = screen.getByRole('combobox');
        const consentimiento = screen.getByRole('checkbox', { name: /Acepto ser contactado/ });

        await usuario.type(nombre, 'Matías Silva');
        await usuario.type(correo, 'matias@gmail.com');
        await usuario.selectOptions(motivo, 'general');
        await usuario.type(mensaje, 'Quisiera consultar por una guitarra acústica.');
        await usuario.click(consentimiento);
        await usuario.click(screen.getByRole('button', { name: 'Enviar Consulta' }));

        expect(screen.getByRole('alert')).toHaveTextContent('¡Mensaje enviado con éxito!');
        expect(nombre).toHaveValue('');
        expect(correo).toHaveValue('');
        expect(mensaje).toHaveValue('');
        expect(motivo).toHaveValue('');
        expect(consentimiento).not.toBeChecked();
    });
});
