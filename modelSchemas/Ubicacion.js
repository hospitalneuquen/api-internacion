var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    nombre: {
        type: String,
        required: true
    },
    nombreCorto: String
});

module.exports = schema
