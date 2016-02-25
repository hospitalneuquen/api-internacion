var mongoose = require('mongoose'),
    schemaEvolucion = require('../schemas/Evolucion.js');

module.exports = mongoose.model('Evolucion', schemaEvolucion);
