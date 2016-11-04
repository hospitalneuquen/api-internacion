var mongoose = require('mongoose'),
    schema = require('../schemas/TipoIndicacion.js');

module.exports = mongoose.model('TipoIndicacion', schema, 'tiposIndicaciones');
