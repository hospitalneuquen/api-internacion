var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    schemaTipoPrestacion = require('./TipoPrestacion.js');

var schema = new Schema({
    fechaHora: {
        type: Date,
        required: true,
    },
    tipo: {
        type: schemaTipoPrestacion,
        validar: {
            modelo: require('../models/TipoPrestacion.js'),
            resolver: true
        }
    },
    texto: String,
});

schema.plugin(require('../mongoose/audit'));
schema.plugin(require('../mongoose/validar'));
schema.plugin(require('mongoose-merge-plugin'));
module.exports = schema;
