var express = require('express'),
    router = express.Router(),
    async = require('async'),
    TipoEvolucion = require('../models/TipoEvolucion.js'),
    Utils = require("../utils/Utils.js");

router.get('/tipoEvolucion/:id*?', function(req, res, next) {
    if (typeof req.params.id != "undefined") {
        TipoEvolucion.findOne({
            _id: req.params.id
        }).exec(function(err, data) {
            if (err) return next(err);
            if (!data) return next(404);

            res.json(data);
        });
    } else {
        var conditions = "";

        if (req.query.nombre){
            // query.where('nombre').regex(new RegExp(req.query.nombre.toLowerCase()));
            conditions["nombre"] = {
                "$regex": Utils.makePattern(req.query.nombre)
            };
        }

        if (req.params.idTipoEvolucion)
            query.where('idTipoEvolucion').equals(req.params.idTipoEvolucion);

        var query = TipoEvolucion.find(conditions);

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
 * /cama/{idCama}:
 *   post:
 *     tags:
 *       - Cama
 *     summary: Modifica / crea una cama
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: idCama
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
router.post('/tipoEvolucion/:idTipoEvolucion?', function(req, res, next) {
    async.waterfall([
        // 1. Busca tipo indicacion
        function(asyncCallback) {
            TipoEvolucion.findOne({
                _id: req.params.idTipoEvolucion
            }, function(err, tipoEvolucion) {
                if (err) return asyncCallback(err);

                if (!tipoEvolucion){
                    var tipoEvolucion = new TipoEvolucion(req.body);
                }else{
                    tipoEvolucion.merge(req.body);
                }

                asyncCallback(err, tipoEvolucion);
            });
        },
        // 2. Guarda la internacion modificada
        function(tipoEvolucion, asyncCallback) {
            // cama.audit(req.user);
            tipoEvolucion.save(function(err) {
                asyncCallback(err, tipoEvolucion);
            });
        },
    ],
    function(err, tipoEvolucion) {
        if (err) return next(err);

        res.json(tipoEvolucion);
    });
});

module.exports = router;
