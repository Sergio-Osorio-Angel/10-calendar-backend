const { response } = require("express");
const jwt = require('jsonwebtoken');

const validarJWT = (req, res = response, next) => {
    // X-TOKEN en headers
    const token = req.header('x-token');

    if (!token) {
        return res.status(401).json({
            ok: false,
            msg: 'No hay token en la petición'
        });
    }

    try {
        // Payload o Datos del JWT
        const payload = jwt.verify(token, process.env.SECRET_JWT_SEED);

        // Se modifica la request con los datos del JWT
        // Esto para que el controlador pueda manipular los datos del JWT
        req.uid = payload.uid;
        req.uid = payload.name;
        
    } catch (error) {
        return res.status(401).json({
            ok: false,
            msg: 'Token no válido'
        });
    }
    next();
}

module.exports = {
    validarJWT
}