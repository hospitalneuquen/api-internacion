var mongoose = require('mongoose'),
    schemaDiagnostico = require('../schemas/Diagnostico.js');

module.exports = mongoose.model('Diagnostico', schemaDiagnostico, 'diagnosticos');
