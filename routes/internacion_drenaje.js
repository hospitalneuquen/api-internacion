'use strict';

var express = require('express'),
    router = express.Router(),
    async = require('async'),
    Drenaje = require('../models/Drenaje.js'),
    Internacion = require('../models/Internacion.js'),
    Ubicacion = require('../models/Ubicacion.js');

/**
 * @swagger
 * /internacion/{idInternacion}/dreanaje/{idDrenaje}:
 *   post:
 *     tags:
 *       - Dreanajes
 *     summary: Modifica / crea un drenaje
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: idInternacion
 *         description: Id de la internación
 *         in: path
 *         required: true
 *         type: string
 *       - name: idDrenaje
 *         description: Id del drenaje
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Ok
 *       404:
 *         description: Not found
 */
router.post('/internacion/:idInternacion/drenaje/:idDrenaje*?', function(req, res, next) {
    async.waterfall([
            // 1. Busca internación y la modifica
            function(asyncCallback) {
                Internacion.findOne({
                    _id: req.params.idInternacion
                }, function(err, internacion) {
                    if (err) return asyncCallback(err);
                    if (!internacion) return asyncCallback(404);

                    // Crea o modifica el drenaje
                    var drenaje;
                    if (req.params.idDrenaje) { // Update
                        drenaje = internacion.drenajes.find(function(i) {
                            return i._id == req.params.idDrenaje;
                        });
                        if (!drenaje)
                            return asyncCallback(404);
                        drenaje.merge(req.body);
                        // drenaje.validar('servicio', req.body.servicio);
                    } else { // Insert
                        if (!internacion.drenajes)
                            internacion.drenajes = [];
                        internacion.drenajes.push(new Drenaje(req.body));
                        drenaje = internacion.drenajes[internacion.drenajes.length - 1];
                        // drenaje.validar('servicio', req.body.servicio);
                    }
                    asyncCallback(err, internacion, drenaje);
                });
            },
            // 2. Guarda la internacion modificada
            function(internacion, drenaje, asyncCallback) {
                internacion.audit(req.user);
                internacion.save(function(err) {
                    asyncCallback(err, drenaje);
                });
            },
        ],
        function(err, drenaje) {
            if (err) return next(err);
            res.json(drenaje);
        });
});

module.exports = router;
