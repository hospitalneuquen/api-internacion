var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var schema = new Schema({
    nombre: {
        type: String,
        required: true,
    },
    tipoIndicacion: {
        type: Schema.Types.ObjectId,
        ref: 'TipoIndicacion'
    },
    tipoEvolucion: {
        type: Schema.Types.ObjectId,
        ref: 'TipoEvolucion'
    },
    evolucionable: Boolean,
    key: String
});

module.exports = schema;
