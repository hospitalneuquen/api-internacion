var mongoose = require('mongoose'),
    schemaUbicacion = require('../schemas/Ubicacion.js');

module.exports = mongoose.model('Ubicacion', schemaUbicacion, 'ubicaciones');
