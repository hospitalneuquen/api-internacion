var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    schemaCama = require('./Cama.js'),
    schemaUbicacion = require('./Ubicacion.js');

var schema = new Schema({
    fechaHora: {
        type: Date,
        required: true,
    },
    servicio: {
        type: schemaUbicacion,
        required: true,
        validar: {
            modelo: require('../models/Ubicacion.js'),
            resolver: true,
        }
    },
    cama: {
        type: schemaCama,
        required: true,
        validar: {
            modelo: require('../models/Cama.js'),
            resolver: true,
        }
    },
    descripcion: String,
});

schema.plugin(require('../mongoose/audit'));
schema.plugin(require('../mongoose/validar'));
schema.plugin(require('mongoose-merge-plugin')); // Por un bug(?) de mongoose no aplica el plugin global. Hay que habilitarlo acá.
module.exports = schema;
