-- =====================================================
-- BASE DE DATOS: SISTEMA DE PRESTAMOS
-- Estudiante: Diana Azumi Accostupa Alcca
-- =====================================================

CREATE DATABASE IF NOT EXISTS BDPrestamoGuia10;
USE BDPrestamoGuia10;

-- =====================================================
-- TABLA: usuario
-- =====================================================

CREATE TABLE usuario (
    Usuario VARCHAR(15) PRIMARY KEY NOT NULL,
    Password VARCHAR(15) NOT NULL,
    Tipo VARCHAR(15) NOT NULL,
    Nombres VARCHAR(30) NOT NULL,
    Apellidos VARCHAR(30) NOT NULL
) ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_unicode_ci;

	-- =====================================================
	-- TABLA: cliente
	-- =====================================================

	CREATE TABLE cliente (
		NroDocumento VARCHAR(8) PRIMARY KEY,
		TipoDocumento VARCHAR(25) NOT NULL,
        ApellidoPaterno VARCHAR(30),
        ApellidoMaterno VARCHAR(30),
        PrimerNombre VARCHAR(30),
        SegundoNombre VARCHAR(30),
        NroHijos INT(11),
        EstadoCivil VARCHAR(15),
        Sexo VARCHAR(10),
        FechaNacimiento DATE,
        Activo VARCHAR(2)
	) ENGINE=InnoDB
	DEFAULT CHARSET=utf8mb4
	COLLATE=utf8mb4_unicode_ci;
-- =====================================================
-- TABLA: prestamo
-- =====================================================

CREATE TABLE prestamo (

	IdPrestamo INT(11) PRIMARY KEY NOT NULL,
	Monto DECIMAL(8,2) NOT NULL,
	Fecha DATE NOT NULL,
	FrecuenciaPago VARCHAR(20) NOT NULL,
	Usuario VARCHAR(15),
	NroDocumento VARCHAR(8) NOT NULL,
    NroCuotas INT(11),
    Cuota DECIMAL(8,2),
    Interes DECIMAL(8,2),
    FOREIGN KEY (Usuario)
        REFERENCES usuario(Usuario),
	FOREIGN KEY (NroDocumento)
        REFERENCES cliente(NroDocumento)
	) ENGINE=InnoDB
	DEFAULT CHARSET=utf8mb4
	COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TABLA: prestamodetalle
-- =====================================================

CREATE TABLE prestamodetalle (
    IdPrestamoDetalle INT(11) PRIMARY KEY,
    NroCuota INT(11) NOT NULL,
    Fecha DATE NOT NULL,
    Monto DECIMAL(8,2),
    Estado VARCHAR(20),
    IdPrestamo INT(11),
    FOREIGN KEY (IdPrestamo)
        REFERENCES prestamo(IdPrestamo)

) ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_unicode_ci;





-- =====================================================
-- MENSAJE FINAL
-- =====================================================

SELECT 'BASE DE DATOS PRESTAMO CREADA CORRECTAMENTE' AS mensaje;