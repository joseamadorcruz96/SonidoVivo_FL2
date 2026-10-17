import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { Checkout } from '../../src/pages/tienda/Checkout';
import { CarritoProvider } from '../../src/Context/CarritoContext';
import { AuthProvider } from '../../src/Context/AuthContext';

describe('Pruebas en la vista de Checkout', () => {

    beforeEach(() => {
        localStorage.clear();
    });

    it('Renderizado condicional: Muestra aviso de carrito vacío si no hay artículos', () => {
        render(
            <MemoryRouter>
                <AuthProvider>
                    <CarritoProvider>
                        <Checkout />
                    </CarritoProvider>
                </AuthProvider>
            </MemoryRouter>
        );

        expect(screen.getByText('Tu carrito está vacío')).toBeInTheDocument();
        expect(screen.getByRole('link', { name: /Ver Catálogo de Instrumentos/i })).toBeInTheDocument();
    });

    it('Muestra formulario de pago y valida campos obligatorios al intentar pagar sin datos', async () => {
        // Inicializar carrito con un producto en localStorage
        const itemMock = [
            {
                codigo: 'GA001',
                nombre: 'Guitarra Acústica Folk',
                precio: 129990,
                cantidad: 1,
                imagen: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=600&auto=format&fit=crop&q=80',
            }
        ];
        localStorage.setItem('sv_carrito', JSON.stringify(itemMock));

        const usuario = userEvent.setup();

        render(
            <MemoryRouter>
                <AuthProvider>
                    <CarritoProvider>
                        <Checkout />
                    </CarritoProvider>
                </AuthProvider>
            </MemoryRouter>
        );

        // Verifica que se renderiza el formulario
        expect(screen.getByText(/Paso de/i)).toBeInTheDocument();
        expect(screen.getByText(/Guitarra Acústica Folk/i)).toBeInTheDocument();

        // Clic en el botón pagar sin llenar campos
        const botonPagar = screen.getByRole('button', { name: /Pagar ahora/i });
        await usuario.click(botonPagar);

        // Verifica renderizado condicional de mensajes de error
        expect(screen.getByText(/El nombre es obligatorio/)).toBeInTheDocument();
        expect(screen.getByText(/Los apellidos son obligatorios/)).toBeInTheDocument();
        expect(screen.getByText(/El correo electrónico es obligatorio/)).toBeInTheDocument();
        expect(screen.getByText(/La dirección \(calle y número\) es obligatoria/)).toBeInTheDocument();
        expect(screen.getByText(/Debes seleccionar una región de entrega/)).toBeInTheDocument();

    });

    it('Autocompleta nombre, apellidos y email si el usuario inició sesión previamente', () => {
        const itemMock = [{
            codigo: 'GA001',
            nombre: 'Guitarra',
            precio: 1000,
            cantidad: 1,
            imagen: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=600'
        }];
        localStorage.setItem('sv_carrito', JSON.stringify(itemMock));



        const usuarioMock = {
            id: 1,
            nombre: 'Pedro',
            apellidos: 'Hacker',
            email: 'pedro@gmail.com',
            rol: 'cliente',
        };
        localStorage.setItem('sv_sesion_activa', JSON.stringify(usuarioMock));

        render(
            <MemoryRouter>
                <AuthProvider>
                    <CarritoProvider>
                        <Checkout />
                    </CarritoProvider>
                </AuthProvider>
            </MemoryRouter>
        );

        expect(screen.getByDisplayValue('Pedro')).toBeInTheDocument();
        expect(screen.getByDisplayValue('Hacker')).toBeInTheDocument();
        expect(screen.getByDisplayValue('pedro@gmail.com')).toBeInTheDocument();
    });

});
