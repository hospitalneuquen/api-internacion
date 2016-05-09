var mongoose = require('mongoose'),
    schema = require('../schemas/SolicitudPrestaciones.js');

module.exports = mongoose.model('SolicitudPrestaciones', schema, 'solicitudPrestaciones');
