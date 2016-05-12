var express = require('express'),
    router = express.Router(),
    Diagnostico = require('../models/Diagnostico.js');

/**
 * @swagger
 * /ubicacion/{id}:
 *   get:
 *     tags:
 *       - Ubicaciones
 *     summary: Devuelve una ubicación por id
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: Id de la ubicación
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Ok
 *       404:
 *         description: Ubicación no encontrada
 *
 * /ubicacion:
 *   get:
 *     tags:
 *       - Ubicaciones
 *     summary: Busca ubicaciones por nombre y/o tipo
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: nombre
 *         description: Permite buscar por nombre
 *         in: query
 *         required: false
 *         type: string
 *       - name: tipo
 *         description: Permite filtrar por tipo. Notas = A modo de ejemplo, se listan sólo algunos tipos
 *         in: query
 *         required: false
 *         type: string
 *         enum:
 *           - hospital
 *           - servicio
 *           - ciudad
 *           - pais
 *           - barrio
 *     responses:
 *       200:
 *         description: Ok
 *       400:
 *         description: No se ingresó ninguna opción de búsqueda
 */
router.get('/diagnostico/:id*?', function(req, res, next) {
    if (req.params.id) {
        Diagnostico.findOne({
            _id: req.params.id
        }).exec(function(err, data) {
            if (err) return next(err);
            if (!data) return next(404);

            res.json(data);
        });
    } else {

        var query = Diagnostico.find({});
        query.limit(100);

        if (req.query.nombre)
            query.where('nombre').regex(new RegExp(req.query.nombre.toLowerCase()));

        query.exec(function(err, data) {
            if (err) return next(err);
            res.json(data);
        });

    }
});

module.exports = router;
