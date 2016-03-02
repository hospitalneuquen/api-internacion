var express = require('express'),
    router = express.Router(),
    async = require('async'),
    Internacion = require('../models/Internacion.js'),
    Ubicacion = require('../models/Ubicacion.js'),
    Evolucion = require('../models/Evolucion.js'),
    Cama = require('../models/Cama.js');

/**
 * @swagger
 * /internacion/{idInternacion}/evolucion:
 *   post:
 *     tags:
 *       - Evoluciones
 *     summary: Crea una nueva evolución
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
            // 1. Busca internación
            function(asyncCallback) {
                Internacion.findOne({
                    _id: req.params.idInternacion
                }, function(err, internacion) {
                    if (err) return asyncCallback(err);
                    if (!internacion) return asyncCallback(404);

                    // Verifica que exista la evolución
                    if (req.params.idEvolucion && !internacion.evoluciones.find(function(i) {
                            return i._id == req.params.idEvolucion;
                        })) {
                        return asyncCallback(404);
                    }
                    asyncCallback(null, internacion);
                });
            },
            // 2. Crea/modifica evolución y resuelve servicio
            function(internacion, asyncCallback) {
                Ubicacion.findOne({
                    _id: req.body.servicio
                }, function(err, servicio) {
                    if (err) return asyncCallback(err);
                    if (!servicio) return asyncCallback(404);

                    var evolucion;
                    if (req.params.idEvolucion) { // Update
                        evolucion = internacion.evoluciones.find(function(i) {
                            return i._id == req.params.idEvolucion;
                        });
                        evolucion.merge(req.body);
                        evolucion.servicio = servicio;
                    } else { // Insert
                        evolucion = new Evolucion(req.body);
                        evolucion.servicio = servicio;
                        if (!internacion.evoluciones)
                            internacion.evoluciones = [];
                        internacion.evoluciones.push(evolucion);
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
            // 4. Actualiza el mapa de camas
            function(internacion, asyncCallback) {
                Cama.findOneAndUpdate({
                    idInternacion: req.params.idInternacion
                }, {
                    'ultimaEvolucion': internacion.evoluciones[internacion.evoluciones.length - 1]
                }, function(err) {
                    asyncCallback(err, internacion);
                });
            },
        ],
        function(err, internacion) {
            if (err) return next(err);
            res.json(internacion.evoluciones[internacion.evoluciones.length - 1]);
        });
});

module.exports = router;
