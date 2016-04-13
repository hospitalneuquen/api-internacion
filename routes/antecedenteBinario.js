var express = require('express'),
    router = express.Router(),
    AntecedenteBinario = require('../models/AntecedenteBinario.js');

/**
 * @swagger
 * /antecedentes:
 *   get:
 *     tags:
 *       - Antecedentes
 *     summary: Devuelve el listado de antecedentes binarios
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Ok
 *       404:
 *         description: Not found
 */
router.get('/antecedenteBinario', function(req, res, next) {
    AntecedenteBinario.find({}).sort({
        grupo: 1,
        nombre: 1
    }).exec(
        function(err, data) {
            if (err) return next(err);
            if (!data) return next(404);
            res.json(data);
        });
});

module.exports = router;
