var mongoose = require('mongoose'),
    schemaValoracionEnfermeria = require('../schemas/ValoracionEnfermeria.js');

// Config
schemaValoracionEnfermeria.plugin(require('../common/mongoose-config'));

module.exports = mongoose.model('ValoracionEnfermeria', schemaValoracionEnfermeria);
