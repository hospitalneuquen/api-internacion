var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var schema = new Schema({
    estadoFisico: Number,
    estadoMental: Number,
    actividad: Number,
    movilidad: Number,
    incontinencia: Number,
    total: { // 5-9 = Alto, 10-12 Medio, 13-16 Bajo
        type: Number,
        default: 0
    },
});

schema.plugin(require('../mongoose/audit'));
schema.plugin(require('../mongoose/validar'));
schema.plugin(require('mongoose-merge-plugin'));
module.exports = schema;
