export function Catalogo() {
    const catalogo = [
        { id: 1, name: 'Laptop Pro', price: '$1200' },
        { id: 2, name: 'Teclado Mecánico', price: '$90' },
        { id: 3, name: 'Mouse Inalámbrico', price: '$45' },
    ];

    return (
        <section>
            <h2>Catálogo de Productos</h2>
            <ul>
                {catalogo.map((prod) => (
                    <li key={prod.id}>
                        <strong>{prod.name}</strong> - {prod.price}
                    </li>
                ))}
            </ul>
        </section>
    );
}