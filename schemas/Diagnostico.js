var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    idPadre: Number,
    codigo: String,
    nombre: {
        type: String,
        required: true
    },
    activo: Boolean,
    codificador: Number,
    idExterno: { // Referencia identificadores de sistemas externos (SQLServer, etc)
        ubicaciones: Number, //  Tabla SQL.Diagnosticos
    }
});

schema.index({ codigo: 'text', nombre: 'text'});

module.exports = schema;
