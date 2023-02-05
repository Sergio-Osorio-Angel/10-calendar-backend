/**
 * Rutas de Usuarios / AUTH
 * host + /api/auth
 */

const { Router } = require('express');
const { check } = require('express-validator');
const router = Router();

// Controladores
const { crearUsuario, loginUsuario, revalidarToken } = require('../controllers/auth');

// Custom Middlewares
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');


// Rutas
// router.<tipo>(ruta, [middlewares], función del controlador)

router.post('/register',
    [
        //Middlewares
        check('name', 'El nombre es obligatorio').not().isEmpty(),
        check('email', 'El email es obligatorio').isEmail(),
        check('password', 'El password debe de ser de más de 6 caracteres').isLength({ min: 6 }),
        validarCampos
    ],
    crearUsuario);

router.post('/', [
    // Middlewares
    check('email', 'El email es obligatorio').isEmail(),
    check('password', 'El password debe de ser de más de 6 caracteres').isLength({ min: 6 }),
    validarCampos
], loginUsuario);

router.get('/renew', validarJWT, revalidarToken);


// Se debe de exportar el router para que se puedan 
// utilizar las rutas desde el index.js
module.exports = router;