var mongoose = require('mongoose'),
    schema = require('../schemas/TipoPrestacion.js');

module.exports = mongoose.model('TipoPrestacion', schema, 'tipoPrestaciones');
