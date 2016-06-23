var mongoose = require('mongoose'),
    schemaIndicacion = require('../schemas/Indicacion.js');

module.exports = mongoose.model('Indicacion', schemaIndicacion);
