var express = require('express'),
    router = express.Router(),
    async = require('async'),
    Internacion = require('../models/Internacion.js'),
    Diagnostico = require('../models/Diagnostico.js'), // utilizado para resolver manualmente
    Ubicacion = require('../models/Ubicacion.js'); // utilizado para resolver manualmente

/**
 * @swagger
 * /internacion/{id}:
 *   get:
 *     tags:
 *       - Internación
 *     summary: Devuelve una internación por Id
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: Id de la internación
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Ok
 *       404:
 *         description: Not found
 */
router.get('/internacion/:id', function(req, res, next) {
    Internacion.findOne({
            _id: req.params.id
        }).populate('paciente')
        .exec(function(err, data) {
            if (err) return next(err);
            if (!data) return next(404);
            res.json(data);
        });
});

/**
 * @swagger
 * /internacion:
 *   get:
 *     tags:
 *       - Internación
 *     summary: Devuelve internaciones según las opciones de búsqueda
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: estado
 *         description: Estado de la internación (soporte múltiples valores)
 *         in: query
 *         required: false
 *         type: string
 *         enum:
 *           - enIngreso
 *           - enPase
 *           - ingresado
 *           - egresado
 *       - name: paciente
 *         description: Id del paciente (soporte múltiples valores)
 *         in: query
 *         required: false
 *         type: string
 *     responses:
 *       200:
 *         description: Ok
 *       400:
 *         description: No se ingresó ninguna opción de búsqueda
 */
router.get('/internacion/', function(req, res, next) {
    // Parsea opciones
    var opciones = {};
    if (req.query.estado)
        opciones.estado = Array.isArray(req.query.estado) ? {
            $in: req.query.estado
        } : req.query.estado;
    if (req.query.paciente)
        opciones.paciente = Array.isArray(req.query.paciente) ? {
            $in: req.query.paciente
        } : req.query.paciente;

    // Si no ingresó ninguna opción ...
    if (!Object.keys(opciones).length)
        return next(400);

    Internacion.find(opciones).populate('paciente')
        .exec(function(err, data) {
            if (err) return next(err);
            res.json(data);
        });
});

/**
 * @swagger
 * /internacion/{id}:
 *   post:
 *     tags:
 *       - Internación
 *     summary: Modifica una internación por Id
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: Id de la internación
 *         in: path
 *         required: true
 *         type: string
 *       - name: body
 *         description: Objeto
 *         in: body
 *         required: true
 *     responses:
 *       200:
 *         description: Ok
 *       404:
 *         description: Not found
 */
router.post('/internacion/:id', function(req, res, next) {
    async.waterfall([
        // 1. Busca internación y la modifica
        function(asyncCallback) {
            Internacion.findOne({
                _id: req.params.id
            }, function(err, internacion) {
                if (err) return asyncCallback(err);
                if (!internacion) return asyncCallback(404);

                // agregar validaciones iniciales
                //
                //

                // asignamos variables
                if (req.body.estado)
                    internacion.estado = req.body.estado;
                if (req.body.paciente)
                    internacion.paciente = req.body.paciente;
                if (req.body.ingreso)
                    internacion.ingreso = req.body.ingreso;

                if (req.body.egreso) {
                    internacion.egreso = req.body.egreso;

                    if (req.body.egreso.derivadoHacia) {
                        // por un bug en validar() cuando trata de resolver en subdocumentos,
                        // omitimos que resuelva el campo derivadoHacia y lo resolvemos a mano
                        Ubicacion.findOne({
                            _id: req.body.egreso.derivadoHacia
                        }, function(err, ubicacion) {
                            if (err) return next(err);

                            internacion.egreso.derivadoHacia = ubicacion;

                            asyncCallback(err, internacion);
                        });
                    } else {
                        asyncCallback(err, internacion);
                    }
                } else {
                    asyncCallback(err, internacion);
                }

            });
        },

        // 2. Verificamos si el egreso tiene diagnosticos y los resolvemos
        function(internacion, asyncCallback) {

            // if (req.body.egreso && req.body.egreso.diagnosticoAlta && typeof req.body.egreso.diagnosticoAlta.length) {
            //     internacion.egreso['diagnosticoAlta'] = [];
            //
            //     // asignamos los ids de los diagnosticos a buscar a la cola
            //     async.eachSeries(req.body.egreso.diagnosticoAlta, function(idDiagnostico, callback) {
            //         Diagnostico.findOne({
            //             _id: idDiagnostico
            //         }, function(err, data) {
            //             // asignamos el diagnostico al egreso
            //             internacion.egreso.diagnosticoAlta.push(data);
            //
            //             // procesamos siguiente valor de la cola
            //             callback();
            //         });
            //     }, function(err) {
            //         if (err) asyncCallback(err);
            //
            //         asyncCallback(null, internacion);
            //     });
            // } else {
            //     asyncCallback(null, internacion);
            // }

            //  if (req.body.egreso && req.body.egreso.diagnosticoAlta && typeof req.body.egreso.diagnosticoAlta.length) {
            //      internacion.egreso['diagnosticoAlta'] = [];
            //
            //      // asignamos los ids de los diagnosticos a buscar a la cola
            //      async.forEachOf(req.body.egreso.diagnosticoAlta, function(idDiagnostico, key, callback) {
            //          Diagnostico.findOne({
            //              _id: idDiagnostico
            //          }, function(err, data) {
            //              // asignamos el diagnostico al egreso
            //              internacion.egreso.diagnosticoAlta.push(data);
            //
            //              // procesamos siguiente valor de la cola
            //              callback();
            //          });
            //      }, function(err) {
            //          if (err) console.error(err.message);
            //          // configs is now a map of JSON data
            //          asyncCallback(null, internacion);
            //      });
            //  } else {
            //      asyncCallback(null, internacion);
            //  }

            // if (req.body.egreso && req.body.egreso.diagnosticoAlta && typeof req.body.egreso.diagnosticoAlta.length) {
            //     internacion.egreso.diagnosticoAlta = [];
            //
            //     // creamos la cola con la funcionalidad a realizar
            //     var queue = async.queue(function(diagnostico, callback) {
            //         Diagnostico.findOne({
            //             _id: diagnostico
            //         }, function(err, data) {
            //             // asignamos el diagnostico al egreso
            //             internacion.egreso.diagnosticoAlta.push(data);
            //
            //             // procesamos siguiente valor de la cola
            //             callback();
            //         });
            //     }, 1);
            //
            //     // asignamos el callback para cuando la cola ha sido completada
            //     queue.drain = function() {
            //         asyncCallback(null, internacion);
            //     }
            //
            //     // asignamos los ids de los diagnosticos a buscar a la cola
            //     req.body.egreso.diagnosticoAlta.forEach(function(diagnostico, index) {
            //         if (diagnostico) queue.push(diagnostico);
            //     });
            // } else {
            //    asyncCallback(null, internacion);
            // }
               asyncCallback(null, internacion);
        },

        // 3 Guarda la internacion modificada
        function(internacion, asyncCallback) {
            internacion.audit(req.user);
            console.log(internacion);
            internacion.save(function(err, internacion) {
                asyncCallback(err, internacion);
            });
        }
    ], function(err, internacion) {
        if (err) return next(err);

        res.json(internacion);
    });
});

/**
 * @swagger
 * /internacion:
 *   post:
 *     tags:
 *       - Internación
 *     summary: Crea una internación
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: body
 *         description: Objeto
 *         in: body
 *         required: true
 *     responses:
 *       200:
 *         description: Ok
 */
router.post('/internacion', function(req, res, next) {
    var data = new Internacion(req.body);

    if (!data.paciente) {
        res.status(400).send({
            status: 400,
            message: "Debe seleccionar el paciente a internar",
            type: 'internal'
        });
    }

    if (!data.ingreso.motivo) {
        res.status(400).send({
            status: 400,
            message: "Debe indicar el motivo de internación",
            type: 'internal'
        });
    }

    data.egreso = null;

    data.audit(req.user);

    if (req.body.pases && req.body.pases.length) {
        data.pases[0].validar('servicio', req.body.pases[0].servicio);
        data.pases[0].validar('cama', req.body.pases[0].cama);
    }
    //
    // if (data.pases && data.pases.length)
    //     data.pases[0].servicio._id = req.body.pases[0].servicio; // Necesario para 'validarServicio'

    console.log(data);
    data.save(function(err, data) {
        if (err) return next(err);
        console.log(data);
        res.json(data);
    });
});

module.exports = router;
