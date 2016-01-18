var express = require('express');
var router = express.Router();
var Paciente = require('../models/Paciente.js');

router.get('/pacientes', function(req, res, next) {
  var query = Paciente.find({});
  //query.where('age').gt(30);
  //query.limit(10);
  //query.select({name: true});
  query.exec(function(err, data) {
    res.json(data);
  });
});

module.exports = router;
