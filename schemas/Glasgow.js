var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var schema = new Schema({
    ocular: Number,
    verbal: Number,
    motor: Number,
    total: Number
});

schema.plugin(require('../mongoose/audit'));
schema.plugin(require('../mongoose/validar'));
schema.plugin(require('mongoose-merge-plugin'));
module.exports = schema;
