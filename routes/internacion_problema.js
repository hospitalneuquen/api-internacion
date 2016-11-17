'use strict';

var express = require('express'),
    router = express.Router(),
    async = require('async'),
    Internacion = require('../models/Internacion.js'),
    Problema = require('../models/Problema.js');

/**
 * @swagger
 * /internacion/{idInternacion}/prestaciones/{idSolicitudPrestacion}:
 *   post:
 *     tags:
 *       - Pases
 *     summary: Crea / Modifica un pedido de prestacion
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: idInternacion
 *         description: Id de la internación
 *         in: path
 *         required: true
 *         type: string
 *       - name: idSolicitudPrestacion
 *         description: Id de la solicitud de prestacion
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Ok
 *       404:
 *         description: Not found
 */
router.post('/internacion/:idInternacion/problema/:idProblema*?', function(req, res, next) {
    async.waterfall([
            // 1. Busca internación
            function(asyncCallback) {
                Internacion.findOne({
                    _id: req.params.idInternacion
                }, function(err, internacion) {
                    if (err) return asyncCallback(err);
                    if (!internacion) return asyncCallback(404);

                    if (!internacion.problemas){
                        internacion.problemas = [];
                    }

                    // si el problema es una modificacion de un existente
                    // entonces borramos el id para poder generar el nuevo con el new Problema()
                    if (req.body.idProblema){
                        delete req.body.id;
                        delete req.body._id;
                    }

                    // creamos el problema
                    var problema = new Problema(req.body)

                    // asignamos el problema creado a la lista de problemas
                    internacion.problemas.push(problema);

                    // buscamos el problema y lo desactivamos de la lista de problemas
                    if (problema.idProblema){
                        let encontrado = false;

                        internacion.problemas.forEach(function(_problema){
                            if (!encontrado && problema.idProblema == _problema.id){
                                _problema.activo = false;
                                encontrado = true;
                            }
                        });
                    }

                    //console.log(internacion.problemas);
                    asyncCallback(err, internacion, problema);
                });
            },
            // 2. Guarda la internacion modificada
            function(internacion, problema, asyncCallback) {
                internacion.audit(req.user);

                internacion.save(function(err) {
                    asyncCallback(err, internacion, problema);
                });
            },
        ],
        function(err, internacion, _problema) {
            if (err) return next(err);

            // buscamos el problema con los datos de la auditoria
            var problema = internacion.problemas.filter(function ( obj ) {
                return obj._id === _problema._id;
            })[0];

            // luego de tener los datos de auditoria, populamos los campos
            // de servicio y diagnostico y devolvemos el problema
            Problema.populate(problema, 'servicio diagnostico', function(err, problema) {
                res.json(problema);
            });

        });
});

module.exports = router;
