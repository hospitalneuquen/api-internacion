var express = require('express'),
    router = express.Router(),
    async = require('async'),
    Internacion = require('../models/Internacion.js'),
    Tratamiento = require('../models/Tratamiento.js');

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
router.post('/internacion/:idInternacion/tratamiento/:idTratamiento*?', function(req, res, next) {
    async.waterfall([
            // 1. Busca internación
            function(asyncCallback) {
                Internacion.findOne({
                    _id: req.params.idInternacion
                }, function(err, internacion) {
                    if (err) return asyncCallback(err);
                    if (!internacion) return asyncCallback(404);

                    // Crea o modifica la prestacion
                    var tratamiento;
                    if (req.params.idTratamiento) { // Update

                        tratamiento = internacion.tratamientos.find(function(i) {
                            return i._id == req.params.idTratamiento;
                        });
                        if (!tratamiento)
                            return asyncCallback(404);

                        // verificamos que el usuario a editar sea el usuario que
                        // ha creado la evolucion, de lo contrario no tiene permisos
                        if (tratamiento.createdBy.id != req.user.id){
                            res.status(400).send({status:400, message: "No tiene permisos para editar el tratamiento", type:'internal'});
                        }

                        tratamiento.merge(req.body);
                        tratamiento.validar('servicio', req.body.servicio);
                    } else { // Insert
                        if (!internacion.tratamientos)
                            internacion.tratamientos = [];

                        internacion.tratamientos.push(new Tratamiento(req.body));
                        tratamiento = internacion.tratamientos[internacion.tratamientos.length - 1];

                        tratamiento.validar('servicio', req.body.servicio);
                    }

                    asyncCallback(err, internacion);
                });
            },
            // 2. Guarda la internacion modificada
            function(internacion, asyncCallback) {
                internacion.audit(req.user);
                internacion.save(function(err) {
                    asyncCallback(err, internacion);
                });
            },
        ],
        function(err, internacion) {
            if (err) return next(err);
            res.json(internacion.tratamientos[internacion.tratamientos.length - 1]);
        });
});

module.exports = router;
