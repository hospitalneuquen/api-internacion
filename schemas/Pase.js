var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    schemaUbicacion = require('../schemas/Ubicacion.js');

var schema = new Schema({
    fechaHora: {
        type: Date,
        required: true,
    },
    servicio: {
        type: schemaUbicacion,
        required: true,
    },
    cama: {
        type: Schema.Types.ObjectId,
        ref: 'Cama',
        required: true,
    },
    descripcion: String,
});

schema.plugin(require('../mongoose/audit'));
// Por un bug(?) de mongoose no aplica el plugin global. Hay que habilitarlo acá.
schema.plugin(require('mongoose-merge-plugin'));
module.exports = schema;
