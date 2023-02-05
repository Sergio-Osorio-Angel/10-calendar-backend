// Esta importación es solo para habilitar el tipado del response
// Y poder obtener el autocompletado
const { response } = require('express');
const { validationResult } = require('express-validator');

const bcrypt = require('bcryptjs'); // Importación de bcryptjs

// 1. Se importa el modelo de Usuario
const Usuario = require('../models/Usuario');

const { generarJWT } = require('../helpers/jwt');

const crearUsuario = async (request, resp = response) => {

    const { name, email, password } = request.body;

    try {
        // 2. Validamos si existe un registro con determinado campo
        let usuario = await Usuario.findOne({ email: email });

        if (usuario) {
            return resp.status(400).json({
                ok: false,
                msg: 'Un usuario existe con ese correo'
            });
        }

        // 3. Se crea el modelo
        usuario = new Usuario({ name, email, password });

        // 4. Encriptar contraseña
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password, salt);

        // 5. Se almacena en BD
        await usuario.save();

        // 6. Generar JWT
        const token = await generarJWT(usuario.id, usuario.name);

        resp.status(201).json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token: token
        });
    } catch (error) {
        resp.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        });
    }
};

const loginUsuario = async (request, resp = response) => {
    const { email, password } = request.body;
    try {
        // 1. Se verifica si el email se encuentra registrado
        const usuario = await Usuario.findOne({ email });
        if (!usuario) {
            return resp.status(400).json({
                ok: false,
                msg: 'El usuario no existe con ese email'
            });
        }

        // 2. Se verifica la constraseña
        const validPassword = bcrypt.compareSync(password, usuario.password);
        if (!validPassword) {
            return resp.status(400).json({
                ok: false,
                msg: 'Password incorrecto'
            });
        }

        // 3. Generar JWT (Json Web Token)
        const token = await generarJWT(usuario.id, usuario.name);

        resp.status(201).json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token: token
        });
    } catch (error) {
        resp.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        });
    }

};

const revalidarToken = async (request, resp = response) => {

    const { uid, name } = request;

    // Generar un nuevo JWT
    const token = await generarJWT(uid, name);

    resp.json({
        ok: true,
        token: token
    });
};


module.exports = {
    crearUsuario, loginUsuario, revalidarToken
}