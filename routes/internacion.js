var express = require('express'),
    router = express.Router(),
    Internacion = require('../models/Internacion.js');

router
    .get('/internacion/:id', function(req, res, next) {
        Internacion.findOne({
            _id: req.params.id
        }, function(err, data) {
            if (err || !data) {
                var error = new Error(err || '');
                error.status = !data ? 404 : 500;
                next(error);
            } else {
                res.json(data);
            }
        });
    })
    .post('/internacion/:id*?', function(req, res, next) {
        if (req.params.id) {
            // TODO: modificación
             return next("No implementado")
        } else {
            var data = new Internacion({
                paciente: req.body.paciente,
                estado: 'ingresado',
                ingreso: {
                    fechaHora: req.body.fechaHora,
                    tipo: req.body.tipoIngreso,
                    motivo: req.body.motivo,
                    diagnosticoPresuntivo: req.body.diagnosticoPresuntivo,
                },
                pases: req.body.cama ? [{
                    fechaHora: req.body.fechaHora,
                    cama: req.body.cama,
                }] : null
            });
            data.save(function(err, data) {
                if (err) return next(err);
                res.json(data);
            });
        }
    })
    // .patch('/internacion/:id', function(req, res, next) {
    //
    // });

module.exports = router;
