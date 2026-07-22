-- =====================================================================
-- Base de datos: tupa_unsaac
-- Sistema de Gestión TUPA
-- Ejecutar este archivo primero para crear la base de datos vacía.
-- =====================================================================

CREATE DATABASE IF NOT EXISTS tupa_unsaac;
USE tupa_unsaac;

SET FOREIGN_KEY_CHECKS = 0;

-- ---------------------------------------------------------------------
-- Tabla: dependencias
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS dependencias (
  id_dependencia INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(150) NOT NULL
);

-- ---------------------------------------------------------------------
-- Tabla: facultades
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS facultades (
  id_facultad INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL
);

-- ---------------------------------------------------------------------
-- Tabla: escuelas
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS escuelas (
  id_escuela VARCHAR(10) NOT NULL,
  id_facultad INT NOT NULL,
  nombre VARCHAR(100) NOT NULL,
  PRIMARY KEY (id_escuela),
  FOREIGN KEY (id_facultad) REFERENCES facultades(id_facultad)
    ON UPDATE CASCADE ON DELETE RESTRICT
);

-- ---------------------------------------------------------------------
-- Tabla: administradores
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS administradores (
  id_admin INT AUTO_INCREMENT PRIMARY KEY,
  nombre_admin VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  codigo_acceso VARCHAR(6) NOT NULL,
  telefono VARCHAR(15),
  estado ENUM('activo', 'inactivo') NOT NULL DEFAULT 'activo',
  ultimo_acceso DATETIME,
  fecha_creacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ---------------------------------------------------------------------
-- Tabla: tipos_documento
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tipos_documento (
  id_tipo_documento INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL
);

-- ---------------------------------------------------------------------
-- Tabla: usuarios (tabla base para todos los tipos de usuario)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS usuarios (
  id_usuario INT AUTO_INCREMENT PRIMARY KEY,
  tipo_usuario ENUM('estudiante', 'docente', 'administrativo', 'institucional', 'externo', 'general') NOT NULL,
  nombre_completo VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  telefono VARCHAR(15),
  direccion VARCHAR(255)
);

-- ---------------------------------------------------------------------
-- Tabla: datos_estudiante (extiende a usuarios)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS datos_estudiante (
  id_usuario INT NOT NULL,
  codigo_estudiante VARCHAR(20) NOT NULL,
  id_facultad INT NOT NULL,
  id_escuela VARCHAR(10) NOT NULL,
  PRIMARY KEY (id_usuario),
  FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
    ON UPDATE CASCADE ON DELETE CASCADE,
  FOREIGN KEY (id_facultad) REFERENCES facultades(id_facultad)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  FOREIGN KEY (id_escuela) REFERENCES escuelas(id_escuela)
    ON UPDATE CASCADE ON DELETE RESTRICT
);

-- ---------------------------------------------------------------------
-- Tabla: datos_docente (extiende a usuarios)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS datos_docente (
  id_usuario INT NOT NULL,
  dni CHAR(8) NOT NULL,
  categoria VARCHAR(50),
  id_dependencia INT NOT NULL,
  PRIMARY KEY (id_usuario),
  FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
    ON UPDATE CASCADE ON DELETE CASCADE,
  FOREIGN KEY (id_dependencia) REFERENCES dependencias(id_dependencia)
    ON UPDATE CASCADE ON DELETE RESTRICT
);

-- ---------------------------------------------------------------------
-- Tabla: datos_administrativo (extiende a usuarios)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS datos_administrativo (
  id_usuario INT NOT NULL,
  id_dependencia INT NOT NULL,
  PRIMARY KEY (id_usuario),
  FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
    ON UPDATE CASCADE ON DELETE CASCADE,
  FOREIGN KEY (id_dependencia) REFERENCES dependencias(id_dependencia)
    ON UPDATE CASCADE ON DELETE RESTRICT
);

-- ---------------------------------------------------------------------
-- Tabla: datos_institucional (extiende a usuarios)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS datos_institucional (
  id_usuario INT NOT NULL,
  ruc CHAR(11) NOT NULL,
  entidad VARCHAR(255) NOT NULL,
  PRIMARY KEY (id_usuario),
  FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
    ON UPDATE CASCADE ON DELETE CASCADE
);

-- ---------------------------------------------------------------------
-- Tabla: datos_externo (extiende a usuarios)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS datos_externo (
  id_usuario INT NOT NULL,
  documento VARCHAR(20) NOT NULL,
  PRIMARY KEY (id_usuario),
  FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
    ON UPDATE CASCADE ON DELETE CASCADE
);

-- ---------------------------------------------------------------------
-- Tabla: datos_general (extiende a usuarios)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS datos_general (
  id_usuario INT NOT NULL,
  dni CHAR(8) NOT NULL,
  PRIMARY KEY (id_usuario),
  FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
    ON UPDATE CASCADE ON DELETE CASCADE
);

-- ---------------------------------------------------------------------
-- Tabla: tramites (catálogo TUPA)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tramites (
  id_tramite INT AUTO_INCREMENT PRIMARY KEY,
  codigo_tupa VARCHAR(20) NOT NULL UNIQUE,
  nombre VARCHAR(255) NOT NULL,
  descripcion TEXT,
  categoria VARCHAR(100),
  costo DECIMAL(10,2) NOT NULL DEFAULT 0,
  id_dependencia_destino INT NOT NULL,
  tiempo INT COMMENT 'Tiempo estimado en días',
  id_admin INT,
  FOREIGN KEY (id_dependencia_destino) REFERENCES dependencias(id_dependencia)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  FOREIGN KEY (id_admin) REFERENCES administradores(id_admin)
    ON UPDATE CASCADE ON DELETE SET NULL
);

-- ---------------------------------------------------------------------
-- Tabla: requisitos_tramite
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS requisitos_tramite (
  id_requisito INT AUTO_INCREMENT PRIMARY KEY,
  id_tramite INT NOT NULL,
  descripcion TEXT NOT NULL,
  obligatorio TINYINT(1) NOT NULL DEFAULT 1,
  FOREIGN KEY (id_tramite) REFERENCES tramites(id_tramite)
    ON UPDATE CASCADE ON DELETE CASCADE
);

-- ---------------------------------------------------------------------
-- Tabla: expedientes
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS expedientes (
  id_expediente INT AUTO_INCREMENT PRIMARY KEY,
  numero_expediente VARCHAR(30) NOT NULL UNIQUE,
  id_usuario INT NOT NULL,
  id_tramite INT NOT NULL,
  id_tipo_documento INT NOT NULL,
  asunto VARCHAR(255) NOT NULL,
  peticion TEXT,
  folios INT DEFAULT 0,
  fecha_registro DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  codigo_pago VARCHAR(50),
  FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  FOREIGN KEY (id_tramite) REFERENCES tramites(id_tramite)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  FOREIGN KEY (id_tipo_documento) REFERENCES tipos_documento(id_tipo_documento)
    ON UPDATE CASCADE ON DELETE RESTRICT
);

-- ---------------------------------------------------------------------
-- Tabla: documentos_adjuntos
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS documentos_adjuntos (
  id_documento INT AUTO_INCREMENT PRIMARY KEY,
  id_expediente INT NOT NULL,
  nombre_archivo VARCHAR(255) NOT NULL,
  ruta_archivo TEXT NOT NULL,
  extension VARCHAR(10),
  tamano_mb DECIMAL(6,2),
  tipo_documento ENUM('pdf', 'imagen', 'word', 'excel', 'otro') NOT NULL DEFAULT 'pdf',
  fecha_subida DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_expediente) REFERENCES expedientes(id_expediente)
    ON UPDATE CASCADE ON DELETE CASCADE
);

-- ---------------------------------------------------------------------
-- Tabla: pagos
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS pagos (
  id_pago INT AUTO_INCREMENT PRIMARY KEY,
  id_expediente INT NOT NULL,
  codigo_pago VARCHAR(50) NOT NULL,
  monto DECIMAL(10,2) NOT NULL,
  fecha_pago DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  estado ENUM('pendiente', 'pagado', 'anulado') NOT NULL DEFAULT 'pendiente',
  FOREIGN KEY (id_expediente) REFERENCES expedientes(id_expediente)
    ON UPDATE CASCADE ON DELETE CASCADE
);

-- ---------------------------------------------------------------------
-- Tabla: movimientos_expediente
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS movimientos_expediente (
  id_movimiento INT AUTO_INCREMENT PRIMARY KEY,
  id_expediente INT NOT NULL,
  dependencia_origen INT NOT NULL,
  dependencia_destino INT NOT NULL,
  usuario_responsable INT,
  fecha_envio DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  fecha_recepcion DATETIME,
  estado ENUM('enviado', 'recibido', 'en_proceso', 'finalizado', 'observado') NOT NULL DEFAULT 'enviado',
  observaciones TEXT,
  id_admin INT,
  FOREIGN KEY (id_expediente) REFERENCES expedientes(id_expediente)
    ON UPDATE CASCADE ON DELETE CASCADE,
  FOREIGN KEY (dependencia_origen) REFERENCES dependencias(id_dependencia)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  FOREIGN KEY (dependencia_destino) REFERENCES dependencias(id_dependencia)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  FOREIGN KEY (usuario_responsable) REFERENCES usuarios(id_usuario)
    ON UPDATE CASCADE ON DELETE SET NULL,
  FOREIGN KEY (id_admin) REFERENCES administradores(id_admin)
    ON UPDATE CASCADE ON DELETE SET NULL
);

-- ---------------------------------------------------------------------
-- Tabla: registro_formularios
-- Guarda los avances y registros finales del módulo auth
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS registro_formularios (
  id_registro INT AUTO_INCREMENT PRIMARY KEY,
  perfil ENUM('estudiante','docente','dependencia','institucion','general','externo') NOT NULL,
  estado ENUM('borrador','completado') NOT NULL DEFAULT 'borrador',
  paso_actual VARCHAR(80),
  datos_json JSON NOT NULL,
  creado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  actualizado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  completado_en DATETIME NULL
);

SET FOREIGN_KEY_CHECKS = 1;