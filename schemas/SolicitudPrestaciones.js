var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    // Ubicacion = require('../models/Ubicacion.js'),
    // TipoPrestacion = require('../models/TipoPrestacion.js'),
    schemaUbicacion = require('./Ubicacion.js');
    schemaTipoPrestacion = require('./TipoPrestacion.js');

var schema = new Schema({
    fechaHora: {
        type: Date,
        required: true,
    },
    prioridad: {
        type: String,
        enum: ['No prioritario','Urgente', 'Emergencia']
    },
    estado: {
        type: String,
        enum: ['Pendiente', 'Realizada', 'Informada', 'Crítica', 'Cancelada']
    },
    tipoPrestacion: {
        type: schemaTipoPrestacion,
        validar: {
            modelo: require('../models/TipoPrestacion.js'),
            resolver: true
        }
    },
    texto: String,
    servicio: {
        type: schemaUbicacion,
        validar: {
            modelo: require('../models/Ubicacion.js'),
            resolver: true
        }
    },
    turnoFechaHora: {
        type: Date
    },
});

schema.plugin(require('../mongoose/audit'));
schema.plugin(require('../mongoose/validar'));
schema.plugin(require('mongoose-merge-plugin'));
module.exports = schema;
