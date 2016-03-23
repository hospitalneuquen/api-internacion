var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var schema = new Schema({
    nombre: {
        type: String,
        required: true,
    }
});

module.exports = schema;
