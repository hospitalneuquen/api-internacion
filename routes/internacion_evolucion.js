'use strict';

var express = require('express'),
    router = express.Router(),
    async = require('async'),
    Internacion = require('../models/Internacion.js'),
    Ubicacion = require('../models/Ubicacion.js'),
    Evolucion = require('../models/Evolucion.js'),
    Cama = require('../models/Cama.js');

/**
 * @swagger
 * /internacion/{idInternacion}/evolucion/{idEvolucion}:
 *   post:
 *     tags:
 *       - Evoluciones
 *     summary: Modifica una evolución
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: idInternacion
 *         description: Id de la internación
 *         in: path
 *         required: true
 *         type: string
 *       - name: idEvolucion
 *         description: Id de la evolución
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Ok
 *       404:
 *         description: Not found
 */
router.post('/internacion/:idInternacion/evolucion/:idEvolucion*?', function(req, res, next) {
    async.waterfall([
            // 1. Busca internación y la modifica
            function(asyncCallback) {
                Internacion.findOne({
                    _id: req.params.idInternacion
                }, function(err, internacion) {
                    if (err) return asyncCallback(err);
                    if (!internacion) return asyncCallback(404);

                    // Crea o modifica la evolución
                    var evolucion;
                    if (req.params.idEvolucion) { // Update

                        evolucion = internacion.evoluciones.find(function(i) {
                            return i._id == req.params.idEvolucion;
                        });
                        if (!evolucion)
                            return asyncCallback(404);

                        // verificamos que el usuario a editar sea el usuario que
                        // ha creado la evolucion, de lo contrario no tiene permisos
                        if (evolucion.createdBy.id != req.user.id){
                            res.status(400).send({status:400, message: "No tiene permisos para editar la evolución", type:'internal'});
                        }

                        evolucion.merge(req.body);
                        evolucion.validar('servicio', req.body.servicio);
                    } else { // Insert
                        if (!internacion.evoluciones)
                            internacion.evoluciones = [];
                        internacion.evoluciones.push(new Evolucion(req.body));
                        evolucion = internacion.evoluciones[internacion.evoluciones.length - 1];
                        evolucion.validar('servicio', req.body.servicio);
                    }

                    asyncCallback(err, internacion, evolucion);
                });
            },
            // 2. Guarda la internacion modificada
            function(internacion, evolucion, asyncCallback) {
                internacion.audit(req.user);
                internacion.save(function(err) {
                    asyncCallback(err, internacion, evolucion);
                });
            },
            // 3. Si es aislamiento actualizamos la internacion
            function(internacion, evolucion, asyncCallback) {
                if (evolucion.tipo == 'Cuidados especiales'){
                    var indicacion = internacion.indicaciones.find(function(i){
                        return (evolucion.idIndicacion.equals(i._id));
                    });

                    if (indicacion && indicacion.cuidadosEspeciales.tipo == 'Aislamiento'){


                        if (indicacion.cuidadosEspeciales.aislamiento.accion == 'Aislar'){
                            // creamos el aislamiento
                            var aislamiento = {
                                tipo: indicacion.cuidadosEspeciales.aislamiento.tipo,
                                accion: indicacion.cuidadosEspeciales.aislamiento.accion,
                                desde: {
                                    fecha: new Date(),
                                    idEvolucion: evolucion._id,
                                    idIndicacion: evolucion.idIndicacion
                                }
                            };

                            internacion.aislamiento.push(aislamiento);
                        }

                    }

                    internacion.save(function(err){
                        asyncCallback(err, evolucion);
                    });
                }else {
                    asyncCallback(null, evolucion);
                }

            },
            // 3. Actualiza el mapa de camas
            // POR AHORA NO NECESITAMOS ESTA INFO EN EL MAPA DE CAMAS
            // function(evolucion, asyncCallback) {
            //     Cama.findOne({
            //         idInternacion: req.params.idInternacion
            //     }, function(err, cama) {
            //         if (err) return asyncCallback(err);
            //         cama.ultimaEvolucion = evolucion;
            //         cama.validar('servicio', req.body.servicio);
            //         cama.save(function(err) {
            //             console.log(err);
            //             asyncCallback(err, evolucion);
            //         });
            //     })
            // },
        ],
        function(err, evolucion) {
            if (err) return next(err);
            res.json(evolucion);
        });
});

module.exports = router;
