var mongoose = require('mongoose'),
    schemaUbicacion = require('../schemas/Ubicacion.js');

// Config
schemaUbicacion.plugin(require('../common/mongoose-config'));

module.exports = mongoose.model('Ubicacion', schemaUbicacion);
