const express = require('express');
const router = express.Router();
const {
  getProcedimientos,
  getProcedimientoById,
  createProcedimiento,
  updateProcedimiento,
  deleteProcedimiento
} = require('../controllers/controllers');

router.get('/', getProcedimientos);
router.get('/:id', getProcedimientoById);
router.post('/', createProcedimiento);
router.put('/:id', updateProcedimiento);
router.delete('/:id', deleteProcedimiento);

module.exports = router;
