
var express = require('express');
var router = express.Router();
var Persona = require('../models/Persona.js');

router.get('/persona', function(req, res, next) {
    var query = Persona.find({});
    if (req.query.apellido)
        query.where('apellido').equals(req.query.apellido);
    query.limit(10);
    query.exec(function(err, data) {
        res.json(data);
    });
});

module.exports = router;
