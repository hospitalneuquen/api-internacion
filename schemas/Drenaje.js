var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var schema = new Schema({
    lado: {
        type: String,
        enum: ['izquierdo', 'derecho']
    },
    tipo: {
        type: String,
        enum: ['pleural', 'percutaneo']
    },
    fechaDesde: {
        type: Date,
        required: true,
    },
    fechaHasta: {
        type: Date
    }
});

schema.plugin(require('../mongoose/audit'));
schema.plugin(require('../mongoose/validar'));
schema.plugin(require('mongoose-merge-plugin'));
module.exports = schema;
