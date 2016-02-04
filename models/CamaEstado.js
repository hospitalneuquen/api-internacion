var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
        estado: {
            type: String,
            enum: ['ocupada', 'desocupada', 'reparacion'],
            required: true,
            default: 'desocupada'
        },
        motivo: String,
        idUsuario: {
            type: Schema.Types.ObjectId,
            ref: 'Usuario',
            default: null
        },
        idCama: {
            type: Schema.Types.ObjectId,
            ref: 'Cama'
        },
        createdAt : {
            type: Date,
            default: Date.now
        },
        updatedAt : {
            type: Date,
            default: null
        },
        idPersona : {
            type: Schema.Types.ObjectId,
            ref: 'Persona',
            default: null
        }
    }
);

// Config
schema.plugin(require('../common/mongoose-config'));
module.exports = mongoose.model('CamaEstado', schema);
