var express = require('express'),
    router = express.Router(),
    Ubicacion = require('../models/Ubicacion.js');

router
    .get('/ubicacion/:id/descendientes', function(req, res, next) {
        var query = Ubicacion.find({
            ancestros: req.params.id
        });
        if (req.query.tipo)
            query.where('tipo').equals(req.query.tipo);
        if (req.query.nombre)
            query.where('_fulltext').regex(new RegExp(req.query.nombre.toLowerCase()));

        query.exec(function(err, data) {
            if (err) return next(err);
            if (!data) return next(404);

            res.json(data);
        });
    })
    .get('/ubicacion/:id/hijos', function(req, res, next) {
        var query = Ubicacion.find({
            padre: req.params.id
        });
        if (req.query.tipo)
            query.where('tipo').equals(req.query.tipo);
        if (req.query.nombre)
            query.where('_fulltext').regex(new RegExp(req.query.nombre.toLowerCase()));

        query.exec(function(err, data) {
            if (err) return next(err);
            if (!data) return next(404);

            res.json(data);
        });
    })
    .get('/ubicacion/:id*?', function(req, res, next) {
        if (req.params.id) {
            Ubicacion.findOne({
                _id: req.params.id
            }).exec(function(err, data) {
                if (err) return next(err);
                if (!data) return next(404);

                res.json(data);
            });
        } else {
            if (!(req.query.tipo || req.query.nombre))
                return next(400);

            var query = Ubicacion.find({});
            if (req.query.tipo)
                query.where('tipo').equals(req.query.tipo);
            if (req.query.nombre)
                query.where('_fulltext').regex(new RegExp(req.query.nombre.toLowerCase()));

            query.exec(function(err, data) {
                if (err) return next(err);
                res.json(data);
            });
        }
    })

module.exports = router;
