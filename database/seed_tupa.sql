USE tupa_unsaac;

SET FOREIGN_KEY_CHECKS = 0;

-- ---------------------------------------------------------------------
-- dependencias
-- ---------------------------------------------------------------------
INSERT INTO dependencias (id_dependencia, nombre) VALUES
  (1, 'Mesa de Partes'),
  (2, 'Oficina de Admisión'),
  (3, 'Secretaría General'),
  (4, 'Oficina de Grados y Títulos'),
  (5, 'Oficina de Bienestar Universitario'),
  (6, 'Dirección de Servicios Académicos');

-- ---------------------------------------------------------------------
-- facultades
-- ---------------------------------------------------------------------
INSERT INTO facultades (id_facultad, nombre) VALUES
  (1, 'Facultad de Ingeniería'),
  (2, 'Facultad de Ciencias de la Salud'),
  (3, 'Facultad de Ciencias Sociales');

-- ---------------------------------------------------------------------
-- escuelas
-- ---------------------------------------------------------------------
INSERT INTO escuelas (id_escuela, id_facultad, nombre) VALUES
  ('IS01', 1, 'Ingeniería de Sistemas'),
  ('IC01', 1, 'Ingeniería Civil'),
  ('MED01', 2, 'Medicina Humana'),
  ('ENF01', 2, 'Enfermería'),
  ('DER01', 3, 'Derecho');

-- ---------------------------------------------------------------------
-- administradores
-- Se incluye aquí también (idéntico al de schema.sql, con ON DUPLICATE
-- KEY UPDATE) para que este seed sea autosuficiente si alguna vez lo
-- corres solo, reseteando datos sin volver a correr schema.sql.
-- IMPORTANTE: va con id_admin = 1 explícito y ANTES de los otros dos
-- administradores, para garantizar que quede en id_admin = 1 (las
-- referencias en tramites y movimientos_expediente asumen ese id).
-- ---------------------------------------------------------------------
INSERT INTO administradores (id_admin, nombre_admin, email, codigo_acceso, telefono, estado, ultimo_acceso, fecha_creacion)
VALUES (1, 'Administrador Principal', 'admin@localhost', '123456', NULL, 'activo', NULL, NOW())
ON DUPLICATE KEY UPDATE
  codigo_acceso = VALUES(codigo_acceso),
  estado = 'activo';

INSERT INTO administradores (id_admin, nombre_admin, email, codigo_acceso, telefono, estado, ultimo_acceso, fecha_creacion) VALUES
  (2, 'Rosa Martínez Quispe', 'rmartinez@unsaac.edu.pe', '482913', '984512233', 'activo', '2026-07-28 09:15:00', '2025-01-10 08:00:00'),
  (3, 'Carlos Huamán Ttito', 'chuaman@unsaac.edu.pe', '117364', '984512244', 'inactivo', NULL, '2025-03-05 08:00:00')
ON DUPLICATE KEY UPDATE nombre_admin = VALUES(nombre_admin);

-- ---------------------------------------------------------------------
-- tipos_documento
-- ---------------------------------------------------------------------
INSERT INTO tipos_documento (id_tipo_documento, nombre) VALUES
  (1, 'Solicitud simple'),
  (2, 'Solicitud con carácter de declaración jurada'),
  (3, 'Recurso de apelación');

-- ---------------------------------------------------------------------
-- usuarios + tablas de extensión por tipo
-- ---------------------------------------------------------------------
INSERT INTO usuarios (id_usuario, tipo_usuario, nombre_completo, email, telefono, direccion) VALUES
  (1, 'estudiante', 'Juan Carlos Pérez Sánchez', 'jperez@est.unsaac.edu.pe', '984100001', 'Av. de la Cultura 123, Cusco'),
  (2, 'estudiante', 'María Torres Quispe', 'mtorres@est.unsaac.edu.pe', '984100002', 'Urb. Manuel Prado F-12, Cusco'),
  (3, 'estudiante', 'Alberto Vargas Mamani', 'avargas@est.unsaac.edu.pe', '984100003', 'Av. Collasuyo 456, Cusco'),
  (4, 'estudiante', 'José Ramírez Huamán', 'jramirez@est.unsaac.edu.pe', '984100004', 'San Sebastián, Cusco'),
  (5, 'docente', 'Rosa Flores Condori', 'rflores@unsaac.edu.pe', '984100005', 'Wanchaq, Cusco'),
  (6, 'docente', 'Luis Chávez Apaza', 'lchavez@unsaac.edu.pe', '984100006', 'Santiago, Cusco'),
  (7, 'administrativo', 'Katherine Zúñiga Rojas', 'kzuniga@unsaac.edu.pe', '984100007', 'Av. Regional 789, Cusco'),
  (8, 'institucional', 'Municipalidad Provincial del Cusco', 'tramites@muniCusco.gob.pe', '084222333', 'Plaza de Armas s/n, Cusco'),
  (9, 'externo', 'Diego Salazar Ttito', 'dsalazar@gmail.com', '984100009', 'Ttio, Cusco'),
  (10, 'general', 'Katia Ochoa Villena', 'kochoa@gmail.com', '984100010', 'Av. Ejercito 234, Cusco');

INSERT INTO datos_estudiante (id_usuario, codigo_estudiante, id_facultad, id_escuela) VALUES
  (1, '150301', 1, 'IS01'),
  (2, '160245', 1, 'IC01'),
  (3, '170112', 2, 'MED01'),
  (4, '180087', 3, 'DER01');

INSERT INTO datos_docente (id_usuario, dni, categoria, id_dependencia) VALUES
  (5, '23456781', 'Principal', 6),
  (6, '23456782', 'Asociado', 6);

INSERT INTO datos_administrativo (id_usuario, id_dependencia) VALUES
  (7, 3);

INSERT INTO datos_institucional (id_usuario, ruc, entidad) VALUES
  (8, '20164520237', 'Municipalidad Provincial del Cusco');

INSERT INTO datos_externo (id_usuario, documento) VALUES
  (9, '76543210');

INSERT INTO datos_general (id_usuario, dni) VALUES
  (10, '45678912');

-- ---------------------------------------------------------------------
-- tramites (catálogo TUPA)
-- ---------------------------------------------------------------------
INSERT INTO tramites (id_tramite, codigo_tupa, nombre, descripcion, categoria, costo, id_dependencia_destino, tiempo, id_admin) VALUES
  (1, 'TUPA-001', 'Certificado de Estudios', 'Documento que certifica los estudios realizados por el solicitante.', 'Académico', 15.00, 6, 3, 1),
  (2, 'TUPA-002', 'Carnet Universitario', 'Emisión o duplicado del carnet de identificación como estudiante.', 'Administrativo', 10.00, 3, 5, 1),
  (3, 'TUPA-003', 'Grados y Títulos', 'Trámite para la obtención del grado académico o título profesional.', 'Grados y Títulos', 250.00, 4, 30, 1),
  (4, 'TUPA-004', 'Constancia de Matrícula', 'Constancia que acredita la matrícula vigente del estudiante.', 'Académico', 5.00, 6, 1, 1),
  (5, 'TUPA-005', 'Rectificación de Nota', 'Corrección de una nota registrada incorrectamente en el sistema académico.', 'Académico', 8.00, 6, 5, 1),
  (6, 'TUPA-006', 'Constancia de Egresado', 'Constancia que acredita haber concluido el plan de estudios.', 'Académico', 12.00, 6, 3, 1),
  (7, 'TUPA-007', 'Matrícula Extemporánea', 'Autorización de matrícula fuera del cronograma regular.', 'Administrativo', 20.00, 2, 5, 1),
  (8, 'TUPA-008', 'Solicitud de Beca', 'Postulación a los programas de becas y apoyo socioeconómico.', 'Administrativo', 0.00, 5, 15, 1),
  (9, 'TUPA-009', 'Traslado Interno', 'Cambio de escuela profesional dentro de la misma universidad.', 'Administrativo', 30.00, 2, 20, 1),
  (10, 'TUPA-010', 'Duplicado de Carnet Universitario', 'Emisión de un duplicado por pérdida o deterioro del carnet.', 'Administrativo', 10.00, 3, 5, 1);

-- ---------------------------------------------------------------------
-- requisitos_tramite
-- ---------------------------------------------------------------------
INSERT INTO requisitos_tramite (id_tramite, descripcion, obligatorio) VALUES
  (1, 'Recibo de pago por derecho de trámite', 1),
  (1, 'Copia simple del DNI', 1),
  (2, 'Fotografía tamaño carnet', 1),
  (3, 'Constancia de no adeudar a la universidad', 1),
  (3, 'Copia legalizada del grado de bachiller', 1),
  (5, 'Solicitud dirigida al docente del curso', 1),
  (5, 'Sustento documentario del error', 1),
  (8, 'Ficha socioeconómica', 1),
  (8, 'Constancia de ingresos familiares', 0);

-- ---------------------------------------------------------------------
-- expedientes
-- ---------------------------------------------------------------------
INSERT INTO expedientes (id_expediente, numero_expediente, id_usuario, id_tramite, id_tipo_documento, asunto, peticion, folios, fecha_registro, codigo_pago) VALUES
  (1, '2026-000451', 1, 1, 1, 'Certificado de estudios completo', 'Solicito la emisión de mi certificado de estudios de los 10 semestres cursados.', 2, '2026-07-15 09:20:00', 'PAGO-000451'),
  (2, '2026-000452', 2, 3, 2, 'Solicitud de título profesional en Ingeniería de Sistemas', 'Solicito se inicie el trámite de obtención de título profesional.', 5, '2026-07-14 11:05:00', 'PAGO-000452'),
  (3, '2026-000453', 3, 2, 1, 'Duplicado por pérdida del carnet universitario', 'Solicito la emisión de un duplicado de mi carnet universitario por pérdida.', 1, '2026-07-12 14:40:00', 'PAGO-000453'),
  (4, '2026-000454', 4, 5, 1, 'Rectificación de nota del curso de Cálculo II', 'Solicito la revisión y corrección de la nota registrada en el curso de Cálculo II.', 3, '2026-07-10 08:55:00', NULL),
  (5, '2026-000455', 1, 6, 1, 'Constancia de egresado para trámite laboral', 'Solicito constancia de egresado para presentar en mi centro de trabajo.', 1, '2026-07-08 10:10:00', 'PAGO-000455'),
  (6, '2026-000456', 2, 7, 1, 'Matrícula extemporánea semestre 2026-II', 'Solicito autorización para matricularme fuera del cronograma regular.', 2, '2026-07-05 16:30:00', 'PAGO-000456'),
  (7, '2026-000457', 3, 8, 2, 'Solicitud de beca socioeconómica', 'Solicito ser considerado para el programa de becas por situación económica.', 4, '2026-07-03 09:00:00', NULL),
  (8, '2026-000458', 9, 9, 1, 'Traslado interno a la Escuela de Ingeniería Civil', 'Solicito el traslado interno de Ingeniería de Sistemas a Ingeniería Civil.', 3, '2026-06-22 12:15:00', 'PAGO-000458'),
  (9, '2026-000459', 4, 4, 1, 'Constancia de matrícula vigente', 'Solicito constancia de matrícula del semestre en curso.', 1, '2026-07-20 07:45:00', 'PAGO-000459'),
  (10, '2026-000460', 10, 10, 1, 'Duplicado de carnet por deterioro', 'Solicito un duplicado de mi carnet universitario por deterioro físico.', 1, '2026-07-22 13:00:00', NULL);

-- ---------------------------------------------------------------------
-- documentos_adjuntos
-- ---------------------------------------------------------------------
INSERT INTO documentos_adjuntos (id_expediente, nombre_archivo, ruta_archivo, extension, tamano_mb, tipo_documento, fecha_subida) VALUES
  (1, 'dni_juan_perez.pdf', '/uploads/expedientes/1/dni_juan_perez.pdf', 'pdf', 0.85, 'pdf', '2026-07-15 09:21:00'),
  (1, 'recibo_pago_451.pdf', '/uploads/expedientes/1/recibo_pago_451.pdf', 'pdf', 0.32, 'pdf', '2026-07-15 09:22:00'),
  (2, 'bachiller_maria_torres.pdf', '/uploads/expedientes/2/bachiller_maria_torres.pdf', 'pdf', 1.20, 'pdf', '2026-07-14 11:07:00'),
  (3, 'denuncia_perdida.jpg', '/uploads/expedientes/3/denuncia_perdida.jpg', 'jpg', 0.95, 'imagen', '2026-07-12 14:42:00'),
  (7, 'ficha_socioeconomica.docx', '/uploads/expedientes/7/ficha_socioeconomica.docx', 'docx', 0.44, 'word', '2026-07-03 09:05:00');

-- ---------------------------------------------------------------------
-- pagos
-- ---------------------------------------------------------------------
INSERT INTO pagos (id_expediente, codigo_pago, monto, fecha_pago, estado) VALUES
  (1, 'PAGO-000451', 15.00, '2026-07-15 09:18:00', 'pagado'),
  (2, 'PAGO-000452', 250.00, '2026-07-14 11:00:00', 'pagado'),
  (3, 'PAGO-000453', 10.00, '2026-07-12 14:35:00', 'pagado'),
  (5, 'PAGO-000455', 12.00, '2026-07-08 10:05:00', 'pagado'),
  (6, 'PAGO-000456', 20.00, '2026-07-05 16:25:00', 'pagado'),
  (8, 'PAGO-000458', 30.00, '2026-06-22 12:10:00', 'pagado'),
  (9, 'PAGO-000459', 5.00, '2026-07-20 07:40:00', 'pendiente');

-- ---------------------------------------------------------------------
-- movimientos_expediente
-- (define el "estado" que ve el admin: se toma el ÚLTIMO movimiento
--  por expediente, ordenado por fecha_envio)
-- ---------------------------------------------------------------------

-- Expediente 1: Certificado de Estudios -> APROBADO (finalizado)
INSERT INTO movimientos_expediente (id_expediente, dependencia_origen, dependencia_destino, usuario_responsable, fecha_envio, fecha_recepcion, estado, observaciones, id_admin) VALUES
  (1, 1, 6, 7, '2026-07-15 09:25:00', '2026-07-15 10:00:00', 'recibido', NULL, NULL),
  (1, 6, 6, 7, '2026-07-16 09:00:00', '2026-07-16 09:30:00', 'finalizado', 'Certificado emitido y entregado.', 1);

-- Expediente 2: Grados y Títulos -> EN PROCESO (pendiente)
INSERT INTO movimientos_expediente (id_expediente, dependencia_origen, dependencia_destino, usuario_responsable, fecha_envio, fecha_recepcion, estado, observaciones, id_admin) VALUES
  (2, 1, 4, 7, '2026-07-14 11:10:00', '2026-07-14 15:00:00', 'recibido', NULL, NULL),
  (2, 4, 4, 7, '2026-07-17 08:00:00', NULL, 'en_proceso', 'Verificando documentación de bachiller.', 1);

-- Expediente 3: Carnet Universitario -> ENVIADO (recién iniciado)
INSERT INTO movimientos_expediente (id_expediente, dependencia_origen, dependencia_destino, usuario_responsable, fecha_envio, fecha_recepcion, estado, observaciones, id_admin) VALUES
  (3, 1, 3, 7, '2026-07-12 14:45:00', NULL, 'enviado', NULL, NULL);

-- Expediente 4: Rectificación de Nota -> OBSERVADO
INSERT INTO movimientos_expediente (id_expediente, dependencia_origen, dependencia_destino, usuario_responsable, fecha_envio, fecha_recepcion, estado, observaciones, id_admin) VALUES
  (4, 1, 6, 7, '2026-07-10 09:00:00', '2026-07-10 10:00:00', 'recibido', NULL, NULL),
  (4, 6, 6, 7, '2026-07-11 08:30:00', NULL, 'observado', 'Falta el sustento documentario firmado por el docente.', 1);

-- Expediente 5: Constancia de Egresado -> APROBADO (finalizado)
INSERT INTO movimientos_expediente (id_expediente, dependencia_origen, dependencia_destino, usuario_responsable, fecha_envio, fecha_recepcion, estado, observaciones, id_admin) VALUES
  (5, 1, 6, 7, '2026-07-08 10:15:00', '2026-07-08 11:00:00', 'finalizado', 'Constancia emitida.', 1);

-- Expediente 6: Matrícula Extemporánea -> APROBADO (finalizado)
INSERT INTO movimientos_expediente (id_expediente, dependencia_origen, dependencia_destino, usuario_responsable, fecha_envio, fecha_recepcion, estado, observaciones, id_admin) VALUES
  (6, 1, 2, 7, '2026-07-05 16:35:00', '2026-07-06 09:00:00', 'finalizado', 'Matrícula extemporánea autorizada.', 1);

-- Expediente 7: Solicitud de Beca -> EN PROCESO (pendiente)
INSERT INTO movimientos_expediente (id_expediente, dependencia_origen, dependencia_destino, usuario_responsable, fecha_envio, fecha_recepcion, estado, observaciones, id_admin) VALUES
  (7, 1, 5, 7, '2026-07-03 09:05:00', '2026-07-03 14:00:00', 'en_proceso', 'En evaluación por la oficina de bienestar universitario.', NULL);

-- Expediente 8: Traslado Interno -> RECHAZADO (observado + prefijo [RECHAZADO])
INSERT INTO movimientos_expediente (id_expediente, dependencia_origen, dependencia_destino, usuario_responsable, fecha_envio, fecha_recepcion, estado, observaciones, id_admin) VALUES
  (8, 1, 2, 7, '2026-06-22 12:20:00', '2026-06-23 09:00:00', 'recibido', NULL, NULL),
  (8, 2, 2, 7, '2026-06-25 09:00:00', NULL, 'observado', '[RECHAZADO] No cumple con el promedio ponderado mínimo exigido.', 1);

-- Expediente 9: Constancia de Matrícula -> RECIBIDO
INSERT INTO movimientos_expediente (id_expediente, dependencia_origen, dependencia_destino, usuario_responsable, fecha_envio, fecha_recepcion, estado, observaciones, id_admin) VALUES
  (9, 1, 6, 7, '2026-07-20 07:50:00', '2026-07-20 08:30:00', 'recibido', NULL, NULL);


-- ---------------------------------------------------------------------
-- registro_formularios
-- (avances del flujo de registro del módulo auth; opcional para probar
--  formularios en borrador y uno ya completado)
-- ---------------------------------------------------------------------
INSERT INTO registro_formularios (perfil, estado, paso_actual, datos_json, creado_en, actualizado_en, completado_en) VALUES
  ('estudiante', 'borrador', 'datos_academicos',
   JSON_OBJECT('nombreCompleto', 'Ana Sofía Quispe Mamani', 'email', 'aquispe@est.unsaac.edu.pe', 'codigoEstudiante', '210456'),
   '2026-07-25 10:00:00', '2026-07-25 10:20:00', NULL),
  ('externo', 'completado', 'finalizado',
   JSON_OBJECT('nombreCompleto', 'Pedro Salinas Loayza', 'email', 'psalinas@gmail.com', 'documento', '70123456'),
   '2026-07-18 09:00:00', '2026-07-18 09:15:00', '2026-07-18 09:15:00');

SET FOREIGN_KEY_CHECKS = 1;