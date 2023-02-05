const { response } = require('express');
const { validationResult } = require('express-validator');

// Un middleware esta compuesto por:
//req : Request
//resp : Response
//next : Es la función que se debe de llamar si todo 
// el middleware se ejecuta correctamente

const validarCampos = (req, resp = response, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return resp.status(400).json({
            ok: false,
            errors: errors.mapped()
        });
    }
    next();
}

module.exports = {
    validarCampos
}