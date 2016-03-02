var express = require('express'),
    router = express.Router(),
    async = require('async'),
    Internacion = require('../models/Internacion.js'),
    Ubicacion = require('../models/Ubicacion.js'),
    Pase = require('../models/Pase.js'),
    Cama = require('../models/Cama.js');

/**
 * @swagger
 * /internacion/{idInternacion}/pase:
 *   post:
 *     tags:
 *       - Pases
 *     summary: Crea un nuevo pase
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: idInternacion
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
/**
 * @swagger
 * /internacion/{idInternacion}/pase/{idPase}:
 *   post:
 *     tags:
 *       - Pases
 *     summary: Modifica un pase
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: idInternacion
 *         description: Id de la internación
 *         in: path
 *         required: true
 *         type: string
 *       - name: idPase
 *         description: Id del pase
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Ok
 *       404:
 *         description: Not found
 */
router.post('/internacion/:idInternacion/pase/:idPase*?', function(req, res, next) {
    async.waterfall([
            // 1. Busca internación
            function(asyncCallback) {
                Internacion.findOne({
                    _id: req.params.idInternacion
                }, function(err, internacion) {
                    if (err) return asyncCallback(err);
                    if (!internacion) return asyncCallback(404);

                    // Verifica que exista el pase
                    if (req.params.idPase && !internacion.pases.find(function(i) {
                            return i._id == req.params.idPase;
                        })) {
                        return asyncCallback(404);
                    }
                    asyncCallback(null, internacion);
                });
            },
            // 2. Crea/modifica pase y resuelve servicio
            function(internacion, asyncCallback) {
                Ubicacion.findOne({
                    _id: req.body.servicio
                }, function(err, servicio) {
                    if (err) return asyncCallback(err);
                    if (!servicio) return asyncCallback(404);

                    var pase;
                    if (req.params.idPase) { // Update
                        pase = internacion.pases.find(function(i) {
                            return i._id == req.params.idPase;
                        });
                        pase.merge(req.body);
                        pase.servicio = servicio;
                    } else { // Insert
                        pase = new Pase(req.body);
                        pase.servicio = servicio;
                        if (!internacion.pases)
                            internacion.pases = [];
                        internacion.pases.push(pase);
                    }

                    asyncCallback(err, internacion);
                });
            },
            // 3. Guarda la internacion modificada
            function(internacion, asyncCallback) {
                internacion.audit(req.user);
                internacion.save(function(err) {
                    asyncCallback(err, internacion);
                });
            },
            // // 4. Actualiza el mapa de camas
            // function(internacion, asyncCallback) {
            //     Cama.findOneAndUpdate({
            //         idInternacion: req.params.idInternacion
            //     }, {
            //         'ultimaPase': internacion.pase[internacion.pase.length - 1]
            //     }, function(err) {
            //         asyncCallback(err, internacion);
            //     });
            // },
        ],
        function(err, internacion) {
            if (err) return next(err);
            res.json(internacion.pases[internacion.pases.length - 1]);
        });
});

module.exports = router;
