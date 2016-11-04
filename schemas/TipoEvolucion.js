var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var schema = new Schema({
    nombre: {
        type: String,
        required: true,
    },
    // tipoEvolucion: {
    //     type: Schema.Types.ObjectId,
    //     ref: 'TipoEvolucion'
    // },
    key: String
});

module.exports = schema;
