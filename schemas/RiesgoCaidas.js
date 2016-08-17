var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var schema = new Schema({
    caidasPrevias: Number,
    marcha: Number,
    ayudaDeambular: Number,
    venoclisis: Number,
    comorbilidad: Number,
    estadoMental: Number,
    total: {
        type: Number,
        default: 0
    },
});

schema.plugin(require('../mongoose/audit'));
schema.plugin(require('../mongoose/validar'));
schema.plugin(require('mongoose-merge-plugin'));
module.exports = schema;
