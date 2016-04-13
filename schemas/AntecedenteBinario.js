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
    frecuente: Boolean,
});

module.exports = schema;
