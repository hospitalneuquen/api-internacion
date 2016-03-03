var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var schema = new Schema({
    nombre: {
        type: String,
        required: true,
    },
    grupo: {
        type: String,
        required: true,
    },
    idExterno: { // Referencia identificadores de sistemas externos (SQLServer, etc)
        prestacionesTipos: Number, //  Tabla SQL.Prestaciones_Tipos
        ubicacion: Number, //  Tabla SQL.Ubicaciones
    }
});

module.exports = schema;
