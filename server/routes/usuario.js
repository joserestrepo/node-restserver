const { Router } = require('express');
const route = Router();
const Usuario = require('../model/usuario.model');

const bcrypt = require('bcrypt');
const _ = require('underscore');

route.get('/usuario', function(req, res) {
    let desde = Number(req.query.desde) || 0;
    let limite = Number(req.query.limite) || 5;

    Usuario.find({ estado: true }, 'nombre email role img estado')
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    message: err
                });
            }

            Usuario.countDocuments({ estado: true }, (err, conteo) => {
                return res.status(200).json({
                    ok: true,
                    usuarios,
                    conteo
                });
            });

        });
});

route.post('/usuario', function(req, res) {
    body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role,
    });

    usuario.save((err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                message: err
            });
        }

        return res.status(200).json({
            ok: true,
            usuario: usuarioDB
        });
    });

});

route.put('/usuario/:id', function(req, res) {
    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);

    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: err
            });
        }

        return res.status(200).json({
            ok: true,
            usuario: usuarioDB
        });
    });
});

route.delete('/usuario/:id', function(req, res) {
    let id = req.params.id;


    Usuario.findByIdAndUpdate(id, { estado: false }, { new: true }, (err, usuarioDesabilitado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: err
            });
        }
        if (!usuarioDesabilitado) {
            return res.status(400).json({
                ok: false,
                mensaje: "El usuario no existe en la base de datos"
            });
        }
        res.status(200).json({
            ok: true,
            usuario: usuarioDesabilitado
        });

    });

    // Usuario.findByIdAndRemove(id, (err, usuarioEliminado) => {
    //     if (err) {
    //         return res.status(500).json({
    //             ok: false,
    //             mensaje: err
    //         });
    //     }
    //     if (!usuarioEliminado) {
    //         return res.status(400).json({
    //             ok: false,
    //             mensaje: "El usuario no existe en la base de datos"
    //         });
    //     }

    //     res.status(200).json({
    //         ok: true,
    //         usuario: usuarioEliminado
    //     });
    // });
});

module.exports = route;