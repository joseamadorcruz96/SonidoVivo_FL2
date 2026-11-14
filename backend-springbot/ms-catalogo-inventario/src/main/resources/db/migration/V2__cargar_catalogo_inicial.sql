-- Datos iniciales de SonidoVivo a partir del catálogo original de React.
INSERT INTO catalogo.categorias (nombre, descripcion)
VALUES
    ('Guitarras Acústicas', 'Guitarras de caja acústica y guitarras clásicas.'),
    ('Guitarras Eléctricas', 'Guitarras eléctricas para ensayo y escenario.'),
    ('Bajos Eléctricos', 'Bajos eléctricos para estudio y presentaciones.'),
    ('Baterías', 'Baterías acústicas y electrónicas.'),
    ('Teclados y Pianos', 'Teclados digitales y pianos.'),
    ('Amplificadores', 'Amplificadores para instrumentos musicales.'),
    ('Pedales de Efectos', 'Pedales para modificar el sonido del instrumento.'),
    ('Accesorios', 'Cuerdas y otros accesorios para instrumentos.')
    ON CONFLICT (nombre) DO NOTHING;

WITH productos_iniciales (
                          codigo, nombre, categoria, marca, modelo, precio, stock, stock_critico,
                          descripcion, imagen, destacado
    ) AS (
    VALUES
        (
            'GA001', 'Guitarra Acústica Folk', 'Guitarras Acústicas',
            'Yamaha', 'F310', 129990, 8, 2,
            'Tapa de abeto, aros y fondo de meranti. Ideal para estudiantes y principiantes.',
            'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=600&auto=format&fit=crop&q=80',
            FALSE
        ),
        (
            'GA003', 'Guitarra Clásica Española 4/4', 'Guitarras Acústicas',
            'Yamaha', 'C40', 89990, 10, 3,
            'Cuerdas de nailon, tapa de abeto. Sonido cálido ideal para estudio clásico y folclor.',
            'https://images.unsplash.com/photo-1525201548942-d8732f6617a0?w=600&auto=format&fit=crop&q=80',
            FALSE
        ),
        (
            'GE001', 'Guitarra Eléctrica Stratocaster', 'Guitarras Eléctricas',
            'Squier', 'Affinity Strat', 249990, 5, 2,
            'Cuerpo de álamo liviano, mástil de arce en ''C'', 3 pastillas single-coil clásicas.',
            'https://images.unsplash.com/photo-1564186763535-ebb21ef5277f?w=600&auto=format&fit=crop&q=80',
            TRUE
        ),
        (
            'GE002', 'Guitarra Eléctrica Les Paul Standard', 'Guitarras Eléctricas',
            'Epiphone', 'Les Paul Std', 329990, 4, 2,
            'Cuerpo de caoba con tapa de arce, 2 pastillas humbucker para rock potente y blues.',
            'https://images.unsplash.com/photo-1516924962500-2b4b3b99ea02?w=600&h=380&auto=format&fit=crop&q=80',
            TRUE
        ),
        (
            'BA001', 'Bajo Eléctrico 4 Cuerdas', 'Bajos Eléctricos',
            'Squier', 'Affinity PJ', 299990, 5, 2,
            'Configuración versátil de pastillas PJ, mástil delgado y escala estándar de 34 pulgadas.',
            'https://images.unsplash.com/photo-1571797672731-8b158bcca644?w=600&h=380&auto=format&fit=crop&q=80',
            TRUE
        ),
        (
            'BA002', 'Bajo Eléctrico Jazz Bass', 'Bajos Eléctricos',
            'Fender', 'Player Jazz', 699990, 2, 1,
            'Cuerpo de aliso, 2 pastillas Alnico V Jazz single-coil. Definición y pegada profesional.',
            'https://images.unsplash.com/photo-1607033992251-5d5f04f0382c?w=600&h=380&auto=format&fit=crop&q=80',
            FALSE
        ),
        (
            'BT001', 'Batería Acústica 5 Piezas', 'Baterías',
            'Pearl', 'Roadshow', 599990, 2, 1,
            'Set completo listo para tocar: bombo, toms, caja, herrajes dobles, pedal y platillos.',
            'https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?w=600&auto=format&fit=crop&q=80',
            FALSE
        ),
        (
            'BT002', 'Batería Electrónica 8 Pads', 'Baterías',
            'Roland', 'TD-02KV', 799990, 2, 1,
            'Módulo con sonidos V-Drums legendarios, pads de respuesta natural, conexión USB.',
            'https://static.roland.com/products/td-02kv/images/td-02kv_hero.jpg',
            FALSE
        ),
        (
            'TC001', 'Teclado Digital 61 Teclas', 'Teclados y Pianos',
            'Yamaha', 'PSR-E373', 249990, 4, 2,
            '61 teclas sensibles al tacto, 622 voces de alta calidad, función de lecciones y USB to Host.',
            'https://images.unsplash.com/photo-1598653222000-6b7b7a552625?w=600&h=380&auto=format&fit=crop&q=80',
            TRUE
        ),
        (
            'AM002', 'Amplificador Guitarra 40W', 'Amplificadores',
            'Marshall', 'MG40GFX', 299990, 3, 1,
            '40 watts de potencia, 4 canales programables, efectos digitales (reverb, delay, chorus).',
            'https://images.ctfassets.net/javen7msabdh/5PjrjYH8aPtcjoByeJHdCk/83c83c178cd8b8ba2e1c4cfe5eed4f4a/mg30fx-mobile-01.jpg',
            FALSE
        ),
        (
            'PE001', 'Pedal de Distorsión Clásico', 'Pedales de Efectos',
            'Boss', 'DS-1', 79990, 7, 2,
            'El pedal de distorsión más vendido del mundo. Ataque definido para guitarras y teclados.',
            'https://static.roland.com/products/ds-1/images/ds-1_hero.jpg',
            FALSE
        ),
        (
            'AC001', 'Cuerdas Guitarra Eléctrica 09-42', 'Accesorios',
            'Ernie Ball', 'Super Slinky', 8990, 25, 5,
            'Juego de 6 cuerdas niqueladas para guitarra eléctrica. Calibre ligero de alta duración.',
            'https://images.unsplash.com/photo-1697924332507-3e0a455ba432?w=600&h=380&auto=format&fit=crop&q=80',
            FALSE
        )
)
INSERT INTO catalogo.productos (
    codigo, nombre, marca, modelo, precio, stock, stock_critico,
    descripcion, imagen, destacado, categoria_id
)
SELECT
    p.codigo, p.nombre, p.marca, p.modelo, p.precio, p.stock, p.stock_critico,
    p.descripcion, p.imagen, p.destacado, c.id
FROM productos_iniciales p
         JOIN catalogo.categorias c ON c.nombre = p.categoria
    ON CONFLICT (codigo) DO NOTHING;