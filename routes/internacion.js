var express = require('express'),
    router = express.Router(),
    ObjectID = require('mongodb').ObjectID,
    Internacion = require('../models/Internacion.js');

router
    .get('/internacion/:id', function(req, res, next) {
        Internacion.findOne({
            _id: new ObjectID(req.params.id)
        }, function(err, data) {
            if (err || !data) {
                var error = new Error(err || '');
                error.status = !data ? 404 : 500;
                next(error);
            } else {
                res.json(data);
            }
        });
    }).patch('/internacion/:id', function(req, res, next) {

    });

module.exports = router;
