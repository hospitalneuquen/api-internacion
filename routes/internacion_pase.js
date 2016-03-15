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

                    // Crea o modifica un pase
                    var pase;
                    if (req.params.idPase) { // Update
                        pase = internacion.pases.find(function(i) {
                            return i._id == req.params.idPase;
                        });
                        if (!pase)
                            return asyncCallback(404);
                        pase.merge(req.body);
                        pase.validar('servicio', req.body.servicio);
                        pase.validar('cama', req.body.cama);
                    } else { // Insert
                        if (!internacion.pases)
                            internacion.pases = [];
                        internacion.pases.push(new Pase(req.body));
                        pase = internacion.pases[internacion.pases.length - 1];
                        pase.validar('servicio', req.body.servicio);
                        pase.validar('cama', req.body.cama);
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
            res.json(internacion.pases[internacion.pases.length - 1]);
        });
});

module.exports = router;
