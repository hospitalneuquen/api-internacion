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
                    asyncCallback(err, evolucion);
                });
            },
            // 3. Actualiza el mapa de camas
            function(evolucion, asyncCallback) {
                Cama.findOneAndUpdate({
                    idInternacion: req.params.idInternacion
                }, {
                    'ultimaEvolucion': evolucion
                }, function(err) {
                    asyncCallback(err, evolucion);
                });
            },
        ],
        function(err, evolucion) {
            if (err) return next(err);
            res.json(evolucion);
        });
});

module.exports = router;
