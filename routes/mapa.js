var express = require('express');
var router = express.Router();
var Mapa = require('../models/Cama.js');

router.get('/mapa/:idServicio*?', function(req, res, next) {
    //var query = Mapa.find({"servicio.id": req.params.idServicio});
    var query = Mapa.find({});
    if (req.params.idServicio)
        query.where('servicio.id').equals(req.params.idServicio);
    // else {
    //     query.limit(10);
    // }
    query.exec(function(err, data) {
        res.json(data);
    });
});

module.exports = router;
