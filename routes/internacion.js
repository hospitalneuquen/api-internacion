var express = require('express'),
    router = express.Router(),
    Internacion = require('../models/Internacion.js');

router
    .get('/internacion/estado/:estado', function(req, res, next) {
        // Devuelve todas las internaciones por estado
        Internacion.find({
                estado: req.params.estado
            }).populate('paciente', {
                apellido: true,
                nombre: true,
                documento: true,
                obrasSociales: true,
                fechaNacimiento: true,
                fechaNacimientoEstimada: true
            })
            .exec(function(err, data) {
                if (err) return next(err);
                res.json(data);
            });
    })
    .get('/internacion/:id', function(req, res, next) {
        // Devuelve una internación por id
        Internacion.findOne({
            _id: req.params.id
        }, function(err, data) {
            if (err) return next(err);
            if (!data) return next(404);
            res.json(data);
        });
    })
    .post('/internacion/:id*?', function(req, res, next) {
        if (req.params.id) {
            // TODO: modificación
            return next("No implementado")
        } else {
            // ¿Tiene una cama asignada?
            var camaAsignada = req.body.cama;

            var data = new Internacion({
                paciente: req.body.paciente,
                estado: camaAsignada ? 'ingresado' : 'enIngreso',
                ingreso: {
                    fechaHora: req.body.fechaHora,
                    tipo: req.body.tipo,
                    motivo: req.body.motivo,
                    diagnosticoPresuntivo: req.body.diagnosticoPresuntivo,
                },
                pases: camaAsignada ? [{
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
    .patch('/internacion/:id', function(req, res, next) {
        Internacion.findOne({
            _id: req.params.id
        }, function(err, data) {
            if (err) return next(err);
            if (!data) return next(404);

            // Sólo permite modificar algunas propiedades del documento
            ["paciente", "estado"].forEach(function(p) {
                if (p in req.body)
                    data[p] = req.body[p];
            });
            ["fechaHora", "tipo", "motivo", "diagnosticoPresuntivo"].forEach(function(p) {
                if (p in req.body)
                    data.ingreso[p] = req.body[p];
            });

            data.save(function(err, data) {
                if (err) return next(err);
                res.json(data);
            });
        });
    });

module.exports = router;
