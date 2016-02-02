var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    nombre: {
        type: String,
        required: true
    },
    nombreCorto: String
});

// Config
schema.plugin(require('../common/mongoose-config'));
module.exports = mongoose.model('Ubicacion', schema, 'ubicaciones')
