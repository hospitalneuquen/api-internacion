var express = require('express');
var router = express.Router();
var MapaCamas = require('../models/MapaCamas.js');

router.get('/mapa', function(req, res, next) {
    var query = MapaCamas.find({});
    if (req.query.servicio)
        query.where('servicio').equals(req.query.servicio);
    query.limit(50);
    query.exec(function(err, data) {
        res.json(data);
    });
});

module.exports = router;
