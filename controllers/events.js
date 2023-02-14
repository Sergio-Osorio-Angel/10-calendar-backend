const { response } = require("express");
const Evento = require('../models/Evento');

const getEventos = async (req, resp = response) => {

    try {
        const eventos = await Evento.find().populate('user', 'name');

        return resp.status(201).json({
            ok: true,
            eventos
        });
    } catch (error) {
        console.log(error);
        resp.status(500).json({
            ok: false,
            msg: 'Comuniquese con el administrador'
        });
    }
}

const crearEvento = async (req, resp = response) => {
    try {
        const evento = new Evento(req.body);
        evento.user = req.uid;
        const eventoGuardado = await evento.save();

        resp.status(200).json({
            ok: true,
            evento: eventoGuardado
        });

    } catch (error) {
        console.log(error);
        resp.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }
}

const actualizarEvento = async (req, resp = response) => {

    const eventoId = req.params.id;
    const uid = req.uid;
    try {

        const evento = await Evento.findById(eventoId);
        if (!evento) {
            return resp.status(404).json({
                ok: false,
                msg: 'Evento no existe con ese id'
            });
        }

        if (evento.user.toString() !== uid) {
            return resp.status(401).json({
                ok: false,
                msg: 'No tiene privilegio de editar este evento'
            });
        }

        const nuevoEvento = {
            ...req.body,
            user: uid
        }

        const eventoActualizado = await Evento.findByIdAndUpdate(eventoId, nuevoEvento, { new: true });

        return resp.status(201).json({
            ok: true,
            evento: eventoActualizado
        });

    } catch (error) {
        console.log(error);
        resp.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }
}

const eliminarEvento = async (req, resp = response) => {

    const eventoId = req.params.id;
    const uid = req.uid;

    try {

        const evento = await Evento.findById(eventoId);
        if (!evento) {
            return resp.status(404).json({
                ok: false,
                msg: 'Evento no existe con ese id'
            });
        }

        if (evento.user.toString() !== uid) {
            return resp.status(401).json({
                ok: false,
                msg: 'No tiene privilegio para eliminar este evento'
            });
        }

        const eventoEliminado = await Evento.findByIdAndRemove(eventoId);
        return resp.status(201).json({
            ok: true,
            evento: eventoEliminado
        });
        
    } catch (error) {
        console.log(error);
        resp.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }
}

module.exports = {
    getEventos,
    crearEvento,
    actualizarEvento,
    eliminarEvento
}