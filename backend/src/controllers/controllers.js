const { pool } = require('../config/db');

// Obtener todos los procedimientos
const getProcedimientos = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM procedimientos');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener procedimientos', error: error.message });
  }
};

// Obtener un procedimiento por ID
const getProcedimientoById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query('SELECT * FROM procedimientos WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ mensaje: 'Procedimiento no encontrado' });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener el procedimiento', error: error.message });
  }
};

// Crear un nuevo procedimiento
const createProcedimiento = async (req, res) => {
  try {
    const { nombre, descripcion, requisitos, costo, plazo } = req.body;
    const [result] = await pool.query(
      'INSERT INTO procedimientos (nombre, descripcion, requisitos, costo, plazo) VALUES (?, ?, ?, ?, ?)',
      [nombre, descripcion, requisitos, costo, plazo]
    );
    res.status(201).json({ id: result.insertId, mensaje: 'Procedimiento creado correctamente' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al crear el procedimiento', error: error.message });
  }
};

// Actualizar un procedimiento
const updateProcedimiento = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, requisitos, costo, plazo } = req.body;
    await pool.query(
      'UPDATE procedimientos SET nombre=?, descripcion=?, requisitos=?, costo=?, plazo=? WHERE id=?',
      [nombre, descripcion, requisitos, costo, plazo, id]
    );
    res.json({ mensaje: 'Procedimiento actualizado correctamente' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al actualizar el procedimiento', error: error.message });
  }
};

// Eliminar un procedimiento
const deleteProcedimiento = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM procedimientos WHERE id = ?', [id]);
    res.json({ mensaje: 'Procedimiento eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar el procedimiento', error: error.message });
  }
};

module.exports = {
  getProcedimientos,
  getProcedimientoById,
  createProcedimiento,
  updateProcedimiento,
  deleteProcedimiento
};
