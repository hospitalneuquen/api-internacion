var express = require('express'),
    router = express.Router(),
    Internacion = require('../models/Internacion.js'),
    Evolucion = require('../models/Evolucion.js'),
    Cama = require('../models/Cama.js');

// var mongoose = require('mongoose');
// var objEvolucion = mongoose.model('Evolucion', Evolucion);


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
                if (!data) return next(404);
                res.json(data);
            });
    })
    .get('/internacion/:idInternacion/valoracionEnfermeria', function(req, res, next) {
        // Devuelve una valoración inicial de enfermería por idInternación
        Internacion.findOne({
                _id: req.params.idInternacion
            })
            .exec(function(err, data) {
                if (err) return next(err);
                if (!data) return next(404);
                res.json(data);
            });
    })
    .get('/internacion/:idInternacion/evolucion/:idEvolucion*?', function(req, res, next) {
        var params = {};
        var projection = {}

        if (req.params.idInternacion) {
            params = {
                id: req.params.idInternacion
            }
        }

        if (req.params.idEvolucion) {
            params = {
                'evoluciones._id': req.params.idEvolucion
            };
            projection = {
                'evoluciones.$': 1
            };
        }

        var query = Internacion.find(params, projection);
        query.exec(function(err, data) {
            if (err) return next(err);

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

            // angular.forEach(req.body, function(value, key){
            //     data
            // });
            // console.log(req.body);

            data.save(function(err, data) {
                if (err) return next(err);
                res.json(data);
            });
        });
    })

.patch('/internacion/:idInternacion/evolucion/:idEvolucion*?', function(req, res, next) {
    if (req.params.idInternacion) {

        var params = {};

        if (req.params.idInternacion) {
            params = {
                _id: req.params.idInternacion
            }
        }

        if (req.params.idEvolucion) {
            params = {
                'evoluciones._id': req.params.idEvolucion
            };

            var evolucion = req.body;
            var action = {
                $set: {
                    'evoluciones.$': evolucion
                }
            }
        }else {
            // var evolucion = new objEvolucion(req.body);
            var evolucion = new Evolucion(req.body);

            var action = {
                $addToSet: {
                    evoluciones: evolucion
                }
            }

        }

        Internacion.update(params, action, function(err, data) {
            if (err) return next(err);
            if (!data) return next(404);

            // buscamos la cama y actualizamos con los datos de la evolucion
            Cama.findOneAndUpdate({
                idInternacion: req.params.idInternacion
            }, {
                'ultimaEvolucion.fechaHora': req.body.fechaHora
            }, function(err, data) {
                if (err) return next(err);
            });

            res.json(evolucion);

        });
    }

    // res.next(404);
})
.patch('/internacion/:idInternacion/valoracionEnfermeria/', function(req, res, next) {
    if (req.params.idInternacion) {

        Internacion.findById(req.params.idInternacion, function(err, internacion) {
            // Maneja errores en MongoDB
            if (err) return next(err);
            // Error 404: NotFound
            if (!internacion) return next(404);

            //var valoracionInicial = new ValoracionEnfermeria(req.body);
            internacion.enfermeria = req.body;

            internacion.save(function(err, internacion) {
                if (err) return next(err);
                res.json(Internacion);
            });
        });
    }

    // res.next(404);
});
module.exports = router;
