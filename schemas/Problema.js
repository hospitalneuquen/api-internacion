var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    schemaUbicacion = require('./Ubicacion.js');

var schema = new Schema({
    descripcion: {
        type: String,
        required: true,
    },
    activoDesde: {
        type: Date,
        required: true,
    },
    esCronico: Boolean,
    estado: String,
    servicio: {
        type: schemaUbicacion,
        validar: {
            modelo: require('../models/Ubicacion.js'),
            resolver: true
        }
    }
});

schema.plugin(require('../mongoose/audit'));
schema.plugin(require('../mongoose/validar'));
schema.plugin(require('mongoose-merge-plugin'));
module.exports = schema;
