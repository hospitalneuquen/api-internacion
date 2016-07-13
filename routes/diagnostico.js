var express = require('express'),
    router = express.Router(),
    Diagnostico = require('../models/Diagnostico.js'),
    Utils = require("../utils/Utils.js");

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

    if (req.query.idPadre) {
        conditions.idPadre = {
            "$eq": parseInt(req.query.idPadre)
        }
    }

    // if (req.query.nombre) {
    //     // conditions["score"] = {
    //     //     "$meta": "textScore"
    //     // };
    //     conditions["$text"] = {
    //         "$search": req.query.nombre
    //         // ,"language": 'none'
    //         // ,            "$diacriticSensitive": true
    //     };
    // }

    // Las busquedas full text de MongoDB no nos funcionaron, por lo tanto
    // -momentaneamente- antes de incluir ElasticSearch vamos a filtraron los
    // strings con la libreria que agregamos en utils/Utils.js para crear
    // patrones para poder buscar mediante expresiones regulares
    // 13/07 Manu
    if (req.query.nombre) {
        // conditions.nombre = new RegExp(req.query.nombre, "i")
        conditions["nombre"] = {
            "$regex": Utils.makePattern(req.query.nombre)
        };
    }

    var query = Diagnostico.find(conditions);

    query.limit(100);
    query.sort({
        nombre: 1
    });
    query.exec(function(err, data) {
        if (err) return next(err);
        res.json(data);
    });

});

module.exports = router;
