/**
 * Rutas de Eventos / EVENTS
 * host + /api/events
 */

const { Router } = require('express');
const router = Router();

// Middlewares
const { check } = require('express-validator');
const { validarJWT } = require("../middlewares/validar-jwt");
const { validarCampos } = require('../middlewares/validar-campos'); // Este middleware es el encargado de mostrar los errores de check()

// Controlador
const { getEventos, crearEvento, actualizarEvento, eliminarEvento } = require("../controllers/events");

// Helpers
const { isDate } = require('../helpers/isDate');

// -------- RUTAS --------
router.use(validarJWT); // Esta es una forma de declarar un mismo middleware para todas las rutas de un modulo

// Obtener eventos
router.get('/', getEventos);

// Crear un nuevo eventos
router.post('/', [
    check('title', 'El titulo es obligatorio').not().isEmpty(),
    check('start', 'Fecha de inicio es obligatoria').custom(isDate),
    check('end', 'Fecha de finalización es obligatoria').custom(isDate),
    validarCampos
], crearEvento);

// Actualizar evento
router.put('/:id', actualizarEvento);

// Eliminar evento
router.delete('/:id', eliminarEvento);

// Se debe de exportar el router para que se puedan 
// utilizar las rutas desde el index.js
module.exports = router;