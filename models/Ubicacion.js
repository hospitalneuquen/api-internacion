var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    nombre: {
        type: String,
        required: true
    },
    nombreCorto: String,
    _fulltext: String, // Campo utilizado para búsquedas de texto
    tipo: String,
    padre: Schema.Types.ObjectId,
    ancestros: [Schema.Types.ObjectId],
    idExterno: { // Referencia identificadores de sistemas externos (SQLServer, etc)
        ubicaciones: Number, //  Tabla SQL.Ubicaciones
    }
});

// Config
schema.plugin(require('../common/mongoose-config'), {
    removeFields: ['_fulltext']
});
module.exports = mongoose.model('Ubicacion', schema, 'ubicaciones')
