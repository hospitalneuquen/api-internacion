var mongoose = require('mongoose'),
    schema = require('../schemas/TipoEvolucion.js');

module.exports = mongoose.model('TipoEvolucion', schema, 'tiposEvoluciones');
