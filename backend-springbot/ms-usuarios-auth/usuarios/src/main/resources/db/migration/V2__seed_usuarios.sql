INSERT INTO usuario (
    run,
    nombre,
    apellido,
    correo,
    rol,
    password,
    fecha_nacimiento,
    fecha_creacion,
    numero_contacto,
    region,
    comuna,
    direccion
) VALUES
    ('19011021K', 'Pedro', 'Cliente', 'cliente@gmail.com', 'CLIENTE', '$2a$10$7PgiYeAyWXPiFLeI12ehJewpyhe8ZnP5l2wai0wkp8De0YZQiOA92', '1995-03-15', CURRENT_TIMESTAMP, '+56911112222', 'Metropolitana', 'Santiago', 'Av. Libertador 101'),
    ('185554443', 'Ana', 'Vendedora', 'vendedor@gmail.com', 'VENDEDOR', '$2a$10$7PgiYeAyWXPiFLeI12ehJewpyhe8ZnP5l2wai0wkp8De0YZQiOA92', '1993-07-22', CURRENT_TIMESTAMP, '+56922223333', 'Metropolitana', 'Providencia', 'Av. Providencia 450'),
    ('172223334', 'Admin', 'Master', 'admin@gmail.com', 'ADMIN', '$2a$10$7PgiYeAyWXPiFLeI12ehJewpyhe8ZnP5l2wai0wkp8De0YZQiOA92', '1990-01-10', CURRENT_TIMESTAMP, '+56933334444', 'Metropolitana', 'Las Condes', 'Av. Apoquindo 1200'),
    ('164445556', 'Hernán', 'Admin', 'admin@sonidovivo.cl', 'ADMIN', '$2a$10$2ok1ap.voI4ISK.THEpgyuVSGu4mavpg/Elf/fVNc7ddJg0Z3Q9SK', '1988-11-05', CURRENT_TIMESTAMP, '+56944445555', 'Valparaíso', 'Viña del Mar', 'Av. Libertad 800'),
    ('159998887', 'Rodrigo', 'Vendedor', 'vendedor@sonidovivo.cl', 'VENDEDOR', '$2a$10$Uwy8cXtPTemCg1VbKyoFL.8B2K8i6/NgTXJ.nK0N4HytVTRDNBmF6', '1992-06-18', CURRENT_TIMESTAMP, '+56955556666', 'Biobío', 'Concepción', 'Av. O''Higgins 320')
ON CONFLICT DO NOTHING;
