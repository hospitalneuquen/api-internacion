var mongoose = require('mongoose'),
    schemaValoracionEnfermeria = require('../schemas/ValoracionEnfermeria.js');

module.exports = mongoose.model('ValoracionEnfermeria', schemaValoracionEnfermeria);
