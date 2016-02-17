var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    Persona = require('../models/Persona.js'),
    Internacion = require('../models/Internacion.js');

mongoose.set('debug', true);
//var ObjectId = require('mongoose').Types.ObjectId;

var schema = new Schema({
    habitacion: Number,
    numero: Number,
    servicio: {
        id: Number, // 1='clínica médica' 2='clínica quirúrgica'
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
        _id: {
            type: Schema.Types.ObjectId,
            ref: 'Persona'
        },
        //id: String,
        edad: Number,
        apellido: String,
        nombre: String,
        documento: Number,
        fechaNacimiento: Date,
        fechaNacimientoEstimada: Date,
        sexo: {
            type: String,
            enum: ['Masculino', 'Femenino', 'Indeterminado']
        }
    },
    ultimaEvolucion: {
        idUsuario: {
            type: Schema.Types.ObjectId,
            ref: 'Usuario',
            default: null
        },
        fechaHora: Date
    }
});

schema.pre('validate', function(next) {
    var parent = this;

    // validamos la internacion y hacemos un populate de lo datos del paciente
    if (parent.idInternacion) {

        // buscamos la internacion correspondiente
        Internacion.findOne({
                _id: parent.idInternacion
            }).populate('paciente')
            .exec(function(err, data) {

                if (err) {
                    next(new Error("Internacion no encontrada"))
                }

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

// Config
schema.plugin(require('../common/mongoose-config'));
module.exports = mongoose.model('Cama', schema);
