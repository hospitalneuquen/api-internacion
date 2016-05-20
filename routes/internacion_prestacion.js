var express = require('express'),
    router = express.Router(),
    async = require('async'),
    Internacion = require('../models/Internacion.js'),
    SolicitudPrestaciones = require('../models/SolicitudPrestaciones.js');
    TipoPrestacion = require('../models/TipoPrestacion.js');

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
router.post('/internacion/:idInternacion/prestacion/:idSolicitudPrestacion*?', function(req, res, next) {
    async.waterfall([
            // 1. Busca internación
            function(asyncCallback) {
                Internacion.findOne({
                    _id: req.params.idInternacion
                }, function(err, internacion) {
                    if (err) return asyncCallback(err);
                    if (!internacion) return asyncCallback(404);

                    var fechaPrestacion = new Date(req.body.fechaHora);
                    var fechaInternacion = new Date(internacion.ingreso.fechaHora);

                    // si la fecha del pase es menor a la fecha de inicio de internacion
                    if ( (fechaPrestacion.getTime() - fechaInternacion.getTime()) < 0){
                        res.status(400).send({status:400, message: "La fecha de la prestación no puede ser anterior a la fecha de internación", type:'internal'});
                    }

                    if (internacion.estado == 'egresado'){
                        var fechaEgreso = new Date(internacion.egreso.fechaHora);

                        if ( (fechaPase.getTime() - fechaEgreso.getTime()) > 0){
                            res.status(400).send({status:400, message: "La fecha de la prestación no puede ser posterior a la fecha de fin de internación", type:'internal'});
                        }
                    }

                    // Crea o modifica la prestacion
                    var prestacion;
                    if (req.body.id) { // Update
                        prestacion = internacion.prestaciones.find(function(i) {
                            return i._id == req.body.id;
                        });
                        if (!prestacion)
                            return asyncCallback(404);

                        // verificamos que el usuario a editar sea el usuario que
                        // ha creado la evolucion, de lo contrario no tiene permisos
                        if (prestacion.createdBy.id != req.user.id){
                            res.status(400).send({status:400, message: "No tiene permisos para editar la prestacion", type:'internal'});
                        }

                        prestacion.merge(req.body);
                        prestacion.validar('servicio', req.body.servicio);
                        prestacion.validar('tipoPrestacion', req.body.tipoPrestacion);
                    } else { // Insert
                        if (!internacion.prestaciones)
                            internacion.prestaciones = [];

                        internacion.prestaciones.push(new SolicitudPrestaciones(req.body));
                        prestacion = internacion.prestaciones[internacion.prestaciones.length - 1];

                        prestacion.validar('servicio', req.body.servicio);
                        prestacion.validar('tipoPrestacion', req.body.tipoPrestacion);
                    }

                    asyncCallback(err, internacion, prestacion);
                });
            },
            // 2. Guarda la internacion modificada
            function(internacion, prestacion, asyncCallback) {
                internacion.audit(req.user);
                internacion.save(function(err) {
                    asyncCallback(err, internacion);
                });
            },
        ],
        function(err, internacion, prestacion) {
            if (err) return next(err);

            res.json(prestacion);
        });
});

module.exports = router;
