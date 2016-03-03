var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    Persona = require('../models/Persona.js'),
    schemaUbicacion = require('../schemas/Ubicacion.js'),
    schemaEvolucion = require("../schemas/Evolucion.js");

var schema = new Schema({
    habitacion: Number,
    numero: Number,
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
        enum: ['ocupada', 'desocupada', 'reparacion'],
        required: true,
        default: 'desocupada'
    },
    reparacion: {
        idCamaEstado: {
            type: Schema.Types.ObjectId,
            ref: 'CamaEstado'
        },
        motivo: String,
        createdAt: Date
    },
    idInternacion: {
        type: Schema.Types.ObjectId,
        ref: 'Internacion'
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

// middleware
schema.pre('validate', function(next) {
    var parent = this;

    // validamos la internacion y hacemos un populate de los datos del paciente
    if (parent.idInternacion) {
        // buscamos la internacion correspondiente
        Internacion.findOne({
                _id: parent.idInternacion
            }).populate('paciente')
            .exec(function(err, data) {
                if (err)
                    return next("Internacion no encontrada");

                // asignamos los valores del paciente
                parent.paciente = data.paciente;
                next();
            });
    } else {
        next();
    }
});

// declaramos la variable paciente id de forma manual
schema.virtual('paciente.id').get(function(){
    return this.paciente._id;
});

module.exports = mongoose.model('Cama', schema);
