var mongoose = require('mongoose'),
    schema = require('../schemas/Evolucion.js');

module.exports = mongoose.model('Evolucion', schema);
