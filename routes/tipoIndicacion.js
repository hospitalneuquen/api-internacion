var express = require('express'),
    router = express.Router(),
    async = require('async'),
    TipoIndicacion = require('../models/TipoIndicacion.js'),
    Utils = require("../utils/Utils.js");

router.get('/tipoIndicacion/getPadres', function(req, res, next) {
    var query = TipoIndicacion.find({
        "tipoIndicacion": null
    });

    query.limit(100);
    query.sort({
        nombre: 1
    });

    query.exec(function(err, data) {
        if (err) return next(err);
        res.json(data);
    });

});
router.get('/tipoIndicacion/getHijas', function(req, res, next) {
    var query = TipoIndicacion.find({
        "tipoIndicacion": {$ne : null}
    });

    query.limit(100);
    query.sort({
        nombre: 1
    });

    query.exec(function(err, data) {
        if (err) return next(err);
        res.json(data);
    });

});

router.get('/tipoIndicacion/:id*?', function(req, res, next) {
    if (typeof req.params.id != "undefined") {
        TipoIndicacion.findOne({
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

        if (req.params.idTipoIndicacion)
            query.where('idTipoIndicacion').equals(req.params.idTipoIndicacion);

        var query = TipoIndicacion.find(conditions);

        query.populate("tipoIndicacion");
        query.populate("tipoEvolucion");

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
router.post('/tipoIndicacion/:idTipoIndicacion?', function(req, res, next) {
    async.waterfall([
        // 1. Busca tipo indicacion
        function(asyncCallback) {
            TipoIndicacion.findOne({
                _id: req.params.idTipoIndicacion
            }, function(err, tipoIndicacion) {
                if (err) return asyncCallback(err);

                if (!tipoIndicacion){
                    var tipoIndicacion = new TipoIndicacion(req.body);
                }else{
                    tipoIndicacion.merge(req.body);
                }

                asyncCallback(err, tipoIndicacion);
            });
        },
        // 2. Guarda la internacion modificada
        function(tipoIndicacion, asyncCallback) {
            // cama.audit(req.user);
            tipoIndicacion.save(function(err) {
                asyncCallback(err, tipoIndicacion);
            });
        },
    ],
    function(err, tipoIndicacion) {
        if (err) return next(err);

        res.json(tipoIndicacion);
    });
});

module.exports = router;
