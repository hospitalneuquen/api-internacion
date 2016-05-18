var express = require('express'),
    router = express.Router(),
    Diagnostico = require('../models/Diagnostico.js');

/**
 * @swagger
 * /diagnostico/codificadores:
 *   get:
 *     tags:
 *       - Diagnostico
 *     summary: Devuelve los codificadores de los diagnosticos
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Ok
 *       404:
 *         description: Codificador no encontrado
 */
router.get('/diagnostico/codificadores', function(req, res, next) {
    var query = Diagnostico.find({
            idPadre: {
                $eq: ""
            }
        })
        .limit(100)
        .sort('nombre')

    query.exec(function(err, data) {
        if (err) return next(err);

        res.json(data);
    });

});

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
router.get('/diagnostico/:idPadre*?', function(req, res, next) {
    var conditions = {};

    if (req.params.idPadre) {
        conditions.idPadre = {
            "$eq": parseInt(req.params.idPadre)
        }
    }

    if (req.query.nombre) {
        conditions["$text"] = {
            "$search" : req.query.nombre
        }
    }

    var query = Diagnostico.find(conditions);

    query.limit(100);
    query.sort({nombre: 1});

    query.exec(function(err, data) {
        if (err) return next(err);

        res.json(data);
    });

});

module.exports = router;
