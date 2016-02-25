var express = require('express');
var router = express.Router();
var Mapa = require('../models/Cama.js');

/**
 * @swagger
 * /mapa/{id}:
 *   get:
 *     tags:
 *       - Camas
 *     summary: Devuelve un array de objetos del tipo cama segun el servicio.
 *              Ej  1 = Clínica médica, 2 = Clínica quirúrgica, NULL = Todas
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: idServicio
 *         description: Id del servicio a consultar
 *         in: path
 *         required: false
 *         type: integer
 *     responses:
 *       200:
 *         description: Ok
 *       404:
 *         description: Mapa de cama no encontrado
 *
 */
router.get('/mapa/:idServicio*?', function(req, res, next) {
    // console.log(req.params.idServicio);
    var query = Mapa.find({});
    if (req.params.idServicio)
        query.where('servicio._id').equals(req.params.idServicio);
    // else {
    //     query.limit(10);
    // }
    query.sort({
        habitacion: 1,
        numero: 1
    });
    query.populate('evoluciones');
    query.exec(function(err, data) {
        res.json(data);
    });
});

module.exports = router;
