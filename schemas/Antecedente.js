var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    schemaAntecedenteTipo = require('./AntecedenteTipo.js');

var schema = new Schema({
    nombre: {
        type: String,
        required: true,
    },
    tipo: {
        type: schemaAntecedenteTipo,
        validar: {
            modelo: require('../models/AntecedenteTipo.js'),
            resolver: true
        }
    }
});

schema.plugin(require('../mongoose/audit'));
schema.plugin(require('../mongoose/validar'));
schema.plugin(require('mongoose-merge-plugin'));
module.exports = schema;
