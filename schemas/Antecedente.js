var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    // AntecedenteTipo = require('../models/AntecedenteTipo.js'),
    schemaAntecedenteTipo = require('./AntecedenteTipo.js');

var schema = new Schema({
    nombre: {
        type: String,
        //required: true,
    },
    //el id lo declaramos para poder hacer la busqueda por idAntecedenteTipo
    idAntecedenteTipo: {
        type: Schema.Types.ObjectId,
        ref: 'AntecedenteTipo'
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
// schema.plugin(require('mongoose-merge-plugin'));
module.exports = schema;
