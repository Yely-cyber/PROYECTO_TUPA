-- =====================================================================
-- Migración: catálogo de trámites clasificado por perfil de usuario
-- Ejecutar UNA SOLA VEZ, después de schema_tupa.sql y seed_tupa.sql.
-- Si necesitas volver a correrlo, comenta el bloque ALTER TABLE (más
-- abajo) para evitar el error de "columna duplicada".
-- =====================================================================

USE tupa_unsaac;

SET FOREIGN_KEY_CHECKS = 0;

-- ---------------------------------------------------------------------
-- Nueva columna: perfil al que le corresponde el trámite.
-- Reutiliza exactamente los mismos valores que usuarios.tipo_usuario
-- (ver auth.service.js -> perfilPorTipoUsuario) para no introducir un
-- segundo vocabulario de roles en la base de datos.
-- ---------------------------------------------------------------------
ALTER TABLE tramites
  ADD COLUMN perfil_objetivo
    ENUM('estudiante','docente','administrativo','institucional','general','externo')
    NOT NULL DEFAULT 'estudiante'
    AFTER categoria;

-- ---------------------------------------------------------------------
-- Clasificar los 10 trámites ya sembrados (todos son trámites
-- estudiantiles) dentro de la taxonomía de categorías del catálogo.
-- ---------------------------------------------------------------------
UPDATE tramites SET categoria = 'DIRECCIÓN DE REGISTRO Y SERVICIOS ACADÉMICOS', perfil_objetivo = 'estudiante' WHERE id_tramite = 1;  -- Certificado de Estudios
UPDATE tramites SET categoria = 'DIRECCIÓN DE REGISTRO Y SERVICIOS ACADÉMICOS', perfil_objetivo = 'estudiante' WHERE id_tramite = 2;  -- Carnet Universitario
UPDATE tramites SET categoria = 'FACULTADES ESTUDIANTES',                       perfil_objetivo = 'estudiante' WHERE id_tramite = 3;  -- Grados y Títulos
UPDATE tramites SET categoria = 'FACULTADES ESTUDIANTES',                       perfil_objetivo = 'estudiante' WHERE id_tramite = 4;  -- Constancia de Matrícula
UPDATE tramites SET categoria = 'FACULTADES ESTUDIANTES',                       perfil_objetivo = 'estudiante' WHERE id_tramite = 5;  -- Rectificación de Nota
UPDATE tramites SET categoria = 'DIRECCIÓN DE REGISTRO Y SERVICIOS ACADÉMICOS', perfil_objetivo = 'estudiante' WHERE id_tramite = 6;  -- Constancia de Egresado
UPDATE tramites SET categoria = 'FACULTADES ESTUDIANTES',                       perfil_objetivo = 'estudiante' WHERE id_tramite = 7;  -- Matrícula Extemporánea
UPDATE tramites SET categoria = 'DIRECCIÓN DE BIENESTAR UNIVERSITARIO',         perfil_objetivo = 'estudiante' WHERE id_tramite = 8;  -- Solicitud de Beca
UPDATE tramites SET categoria = 'FACULTADES ESTUDIANTES',                       perfil_objetivo = 'estudiante' WHERE id_tramite = 9;  -- Traslado Interno
UPDATE tramites SET categoria = 'DIRECCIÓN DE REGISTRO Y SERVICIOS ACADÉMICOS', perfil_objetivo = 'estudiante' WHERE id_tramite = 10; -- Duplicado de Carnet Universitario

-- ---------------------------------------------------------------------
-- Nuevos trámites para cubrir el resto de perfiles y categorías.
-- id_dependencia_destino apunta a dependencias YA existentes (1-6);
-- esta migración no crea dependencias nuevas.
--   1 Mesa de Partes · 2 Oficina de Admisión · 3 Secretaría General
--   4 Oficina de Grados y Títulos · 5 Oficina de Bienestar Universitario
--   6 Dirección de Servicios Académicos
-- ---------------------------------------------------------------------
INSERT INTO tramites (codigo_tupa, nombre, descripcion, categoria, costo, id_dependencia_destino, tiempo, perfil_objetivo, id_admin) VALUES
  -- Estudiante (categorías adicionales)
  ('TUPA-011', 'Constancia de Estudios de Posgrado', 'Certifica los estudios de maestría o doctorado cursados.', 'ESCUELA DE POSTGRADO ESTUDIANTES', 20.00, 6, 5, 'estudiante', 1),
  ('TUPA-012', 'Carné de Biblioteca', 'Emisión del carné para acceder a los servicios de biblioteca.', 'UNIDAD DE BIBLIOTECA ESTUDIANTES', 5.00, 6, 2, 'estudiante', 1),
  ('TUPA-013', 'Certificado de Competencias Digitales', 'Acredita el nivel de manejo de herramientas ofimáticas.', 'CENTRO DE CÓMPUTO', 8.00, 6, 5, 'estudiante', 1),
  ('TUPA-014', 'Constancia de Nivel de Idioma', 'Certifica el nivel alcanzado en un idioma extranjero.', 'INSTITUTO DE IDIOMAS', 10.00, 6, 3, 'estudiante', 1),

  -- Docente
  ('TUPA-015', 'Carné de Biblioteca para Docentes', 'Emisión del carné de biblioteca para personal docente y administrativo.', 'UNIDAD DE BIBLIOTECA DOCENTES Y ADMINISTRATIVOS', 5.00, 6, 2, 'docente', 1),
  ('TUPA-016', 'Certificado de Capacitación en TIC', 'Constancia de participación en talleres de tecnología.', 'CENTRO DE CÓMPUTO', 8.00, 6, 5, 'docente', 1),
  ('TUPA-017', 'Licencia con Goce de Haber', 'Solicitud de licencia laboral remunerada para personal docente.', 'DIRECCIÓN DE BIENESTAR UNIVERSITARIO', 0.00, 5, 7, 'docente', 1),
  ('TUPA-018', 'Constancia de Trabajo', 'Documento que certifica el vínculo laboral vigente con la universidad.', 'DIRECCIÓN DE REGISTRO Y SERVICIOS ACADÉMICOS', 5.00, 6, 2, 'docente', 1),
  ('TUPA-019', 'Certificado de Nivel de Idioma para Docentes', 'Certifica el nivel alcanzado en un idioma extranjero.', 'INSTITUTO DE IDIOMAS', 10.00, 6, 3, 'docente', 1),

  -- Dependencia (tipo_usuario = administrativo)
  ('TUPA-020', 'Solicitud de Presupuesto', 'Requerimiento de asignación presupuestal para una dependencia.', 'RECTORADO - SECRETARIA GENERAL', 0.00, 3, 15, 'administrativo', 1),
  ('TUPA-021', 'Soporte Técnico Institucional', 'Solicitud de asistencia técnica de equipos o sistemas.', 'CENTRO DE CÓMPUTO', 0.00, 6, 3, 'administrativo', 1),
  ('TUPA-022', 'Reporte Académico Institucional', 'Solicitud de reportes o estadísticas académicas para gestión interna.', 'DIRECCIÓN DE REGISTRO Y SERVICIOS ACADÉMICOS', 0.00, 6, 5, 'administrativo', 1),

  -- Institución (tipo_usuario = institucional)
  ('TUPA-023', 'Convenio Marco Interinstitucional', 'Formalización de un convenio de cooperación con la universidad.', 'RECTORADO - SECRETARIA GENERAL', 0.00, 3, 25, 'institucional', 1),
  ('TUPA-024', 'Autorización de Uso de Espacios', 'Permiso para el uso de auditorios o ambientes institucionales.', 'FACULTADES OTROS', 50.00, 3, 5, 'institucional', 1),

  -- Público General
  ('TUPA-025', 'Constancia de Postulante', 'Certifica la participación en un proceso de admisión.', 'DIRECCIÓN GENERAL DE ADMISIÓN', 15.00, 2, 3, 'general', 1),
  ('TUPA-026', 'Admisión a Programa de Posgrado', 'Postulación a maestrías o doctorados para personas externas a la universidad.', 'ESCUELA DE POSTGRADO ADMISIÓN Y TRASLADO EXTERNO', 300.00, 2, 15, 'general', 1),
  ('TUPA-027', 'Solicitud de Información Pública', 'Acceso a información pública en el marco de la ley de transparencia.', 'FACULTADES OTROS', 0.00, 3, 7, 'general', 1),
  ('TUPA-028', 'Inscripción al Residentado Médico', 'Postulación al programa de residentado médico.', 'RESIDENTADO MEDICO', 350.00, 2, 20, 'general', 1),
  ('TUPA-029', 'Inscripción a Curso de Idiomas Extracurricular', 'Matrícula en cursos de idiomas abiertos al público general.', 'INSTITUTO DE IDIOMAS', 80.00, 6, 3, 'general', 1),
  ('TUPA-030', 'Inscripción a Curso de Ofimática', 'Matrícula en cursos de cómputo abiertos al público general.', 'CENTRO DE CÓMPUTO', 60.00, 6, 3, 'general', 1),

  -- Usuario Externo
  ('TUPA-031', 'Acceso a Archivo Histórico', 'Consulta o reproducción de documentos del archivo institucional.', 'RECTORADO - SECRETARIA GENERAL', 15.00, 3, 10, 'externo', 1),
  ('TUPA-032', 'Constancia para Terceros', 'Documento oficial solicitado por una persona ajena a la universidad.', 'FACULTADES OTROS', 15.00, 3, 5, 'externo', 1)
ON DUPLICATE KEY UPDATE
  nombre = VALUES(nombre),
  descripcion = VALUES(descripcion),
  categoria = VALUES(categoria),
  perfil_objetivo = VALUES(perfil_objetivo);

SET FOREIGN_KEY_CHECKS = 1;
