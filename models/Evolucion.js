var mongoose = require('mongoose'),
    schemaEvolucion = require('../schemas/Evolucion.js');

// Config
schemaEvolucion.plugin(require('../common/mongoose-config'));

module.exports = mongoose.model('Evolucion', schemaEvolucion);
