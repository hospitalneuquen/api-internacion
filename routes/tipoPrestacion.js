var express = require('express'),
    router = express.Router(),
    TipoPrestacion = require('../models/TipoPrestacion.js');

/**
 * @swagger
 * /tipoPrestacion:
 *   get:
 *     tags:
 *       - Varios
 *     summary: Devuelve el listado de tipos de prestaciones
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Ok
 */
router.get('/tipoPrestacion', function(req, res, next) {
    TipoPrestacion.find({}, function(err, data) {
        if (err) return next(err);
        res.json(data);
    });
});

module.exports = router;
