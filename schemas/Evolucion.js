var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    schemaUbicacion = require('../schemas/Ubicacion.js')

var schema = new Schema(
{
    fechaHora: {
        type: Date
    },
    pulso: {
        type: Number
    },
    tensionSistolica: {
        type: Number
    },
    tensionDiastolica: {
        type: Number
    },
    temperatura: {
        type: Number
    },
    respiracion: {
        type: Number
    },
    spo2: {
        type: Number
    },
    peso: {
        type: Number
    },
    texto: String,
    // tipo: {
    //     Enfermeria / Medica
    // },
    idUsuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        default: null
    },
    // servicio: {
    //     _id: {
    //         type: Schema.Types.ObjectId,
    //         ref: 'Ubicacion'
    //     },
    //     nombre: String,
    //     nombreCorto: String
    // }
});

schema.plugin(require('../mongoose/audit'));
module.exports = schema;
