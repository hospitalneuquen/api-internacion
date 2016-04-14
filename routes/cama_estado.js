var express = require('express'),
    router = express.Router(),
    CamaEstado = require('../models/CamaEstado.js');

/**
 * @swagger
 * /cama_estado/{id}:
 *   get:
 *     tags:
 *       - Estados Camas
 *     summary: Devuelve los estados de una cama segun el id de la cama
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: Id de la cama
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Ok
 *       404:
 *         description: Not found
 */
router.get('/cama_estado/:id*?', function(req, res, next) {
    if (req.params.id) {
        CamaEstado.findOne({
            idCama: req.params.id
        }, function(err, data) {
            // Maneja errores en MongoDB
            if (err) return next(err);
            // Error 404: NotFound
            if (!data) return next(404);

            res.json(data);
        });
    } else {
        CamaEstado.find({}, function(err, data) {
            if (err) return next(err);
            res.json(data);
        })
    }
});

module.exports = router;
