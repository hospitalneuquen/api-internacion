var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    Persona = require('../models/Persona.js'),
    schemaUbicacion = require('../schemas/Ubicacion.js'),
    schemaEvolucion = require("../schemas/Evolucion.js");

var schema = new Schema({
    habitacion: Number,
    numero: Number,
    sector: Number,
    servicio: schemaUbicacion,
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
        enum: ['ocupada', 'desocupada', 'reparacion', 'bloqueada'],
        required: true,
        default: 'desocupada'
    },
    ultimoEstado: {
        idCamaEstado: {
            type: Schema.Types.ObjectId,
            ref: 'CamaEstado'
        },
        motivo: String,
        createdAt: Date
    },
    idInternacion: {
        type: Schema.Types.ObjectId,
        ref: 'Internacion',
    },
    paciente: {
        // Al final se declara un virtual 'paciente.id'
        _id: {
            type: Schema.Types.ObjectId,
            ref: 'Persona'
        },
        edad: Number,
        apellido: String,
        nombre: String,
        documento: Number,
        fechaNacimiento: Date,
        fechaNacimientoEstimada: Boolean,
        sexo: {
            type: String,
            enum: ['masculino', 'femenino', 'indeterminado']
        }
    },
    ultimaEvolucion: schemaEvolucion
});

// declaramos la variable paciente id de forma manual
schema.virtual('paciente.id').get(function() {
    return this.paciente._id;
});

schema.plugin(require('../mongoose/audit'));
schema.plugin(require('../mongoose/validar'));
schema.plugin(require('mongoose-merge-plugin')); // Por un bug(?) de mongoose no aplica el plugin global. Hay que habilitarlo acá.
module.exports = schema;
