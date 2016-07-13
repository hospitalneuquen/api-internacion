var express = require('express'),
    router = express.Router(),
    TipoPrestacion = require('../models/TipoPrestacion.js'),
    Utils = require("../utils/Utils.js");

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
router.get('/tipoPrestacion/:id*?', function(req, res, next) {
    if (req.params.id) {
        TipoPrestacion.findOne({
            _id: req.params.id
        }).exec(function(err, data) {
            if (err) return next(err);
            if (!data) return next(404);

            res.json(data);
        });
    } else {
        if (!req.query.nombre)
            return next(400);

        var conditions = "";

        if (req.query.nombre){
            // query.where('nombre').regex(new RegExp(req.query.nombre.toLowerCase()));
            conditions["nombre"] = {
                "$regex": Utils.makePattern(req.query.nombre)
            };
        }

        var query = TipoPrestacion.find(conditions);

        query.limit(100);
        query.sort({
            nombre: 1
        });

        query.exec(function(err, data) {
            if (err) return next(err);
            res.json(data);
        });

    }
});


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
