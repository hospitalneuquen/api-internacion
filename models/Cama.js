var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    habitacion: Number,
    numero: Number,
    servicio: {
        id: Number,    // 1='clínica médica' 2='clínica quirúrgica'
        nombre: String,
    },
    tipoCama: {
        type: String,
        enum: ['cama', 'sillon', 'cuna'],
        required: true,
        default: 'cama'
    },
    oxigeno: {
        type: Boolean,
        required: true,
        default: false
    },
    desinfectada: {
        type: Boolean,
        required: false,
        default: true
    },
    estado: {
        type: String,
        enum: ['ocupada', 'desocupada', 'reparacion'],
        required: true,
        default: 'desocupada'
    },
    idInternacion:  {
        type: Schema.Types.ObjectId,
        ref: 'Internacion'
    },
    paciente: {
        id: {
            type: Schema.Types.ObjectId,
            ref: 'Persona'
        },
        apellido: String,
        nombre: String,
        documento: Number,
        fechaNacimiento: Date,
        sexo: {
            type: String,
            enum: ['Masculino', 'Femenino', 'Indeterminado']
        }
    }
});

schema.set('toJSON', {
    virtuals: true,
    versionKey: false,
});

module.exports = mongoose.model('Cama', schema);
