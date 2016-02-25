var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
        estado: {
            type: String,
            enum: ['ocupada', 'desocupada', 'reparacion', 'desinfectada'],
            required: true,
            default: 'desocupada'
        },
        motivo: String,
        idCama: {
            type: Schema.Types.ObjectId,
            ref: 'Cama'
        },
        idPersona : {
            type: Schema.Types.ObjectId,
            ref: 'Persona',
            default: null
        }
    }
);

schema.plugin(require('../mongoose/audit'));
module.exports = mongoose.model('CamaEstado', schema);
