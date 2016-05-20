var mongoose = require('mongoose'),
    schemaTratamiento = require('../schemas/Tratamiento.js');

module.exports = mongoose.model('Tratamiento', schemaTratamiento);
