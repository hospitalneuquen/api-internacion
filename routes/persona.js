var express = require('express'),
    router = express.Router(),
    Persona = require('../models/Persona.js');

router.get('/persona/:id*?', function(req, res, next) {
    if (req.params.id) {
        Persona.findOne({
            _id: req.params.id
        }).exec(function(err, data) {
            if (err) {
                next(err);
                return
            }

            res.json(data);
        });
    } else {
        if (req.query.fulltext) {
            // TODO: Utilizar ElasticSearch
            // Persona.search({
            //     // match: {
            //     //     _all: req.query.fulltext
            //     // }
            //     query_string: {
            //         "query": req.query.fulltext
            //     }
            // }, {
            //     size: 100,
            //     hydrate: true
            // }, function(err, data) {
            //     res.json(data.hits.hits);
            // });
            var query = Persona.find({
                $text: {
                    $search: req.query.fulltext
                }
            }, {
                score: {
                    $meta: "textScore"
                }
            });
            query.limit(100);
            query.sort({
                score: {
                    $meta: "textScore"
                }
            });
            query.exec(function(err, data) {
                res.json(data);
            });
        } else {
            var hasQuery = false;
            var query = Persona.find({});
            if (req.query.documento) {
                query.where('documento').equals(req.query.documento);
                hasQuery = true;
            }
            if (req.query.apellido) {
                query.where('apellido').equals(RegExp('^' + req.query.apellido + '$', "i"));
                hasQuery = true;
            }
            if (req.query.nombre) {
                hasQuery = true;
                query.where('nombre').equals(RegExp('^' + req.query.nombre + '$', "i"));
            }

            if (!hasQuery) {
                next(new Error("Debe consultar por un párametro como mínimo"));
                return
            }

            // TODO: implementar paginado
            // query.limit(10);
            query.exec(function(err, data) {
                if (err) throw err;
                res.json(data);
            });
        }
    }
});

module.exports = router;
