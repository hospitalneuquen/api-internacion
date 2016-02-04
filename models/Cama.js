var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    Persona = require('../models/Persona.js'),
    Internacion = require('../models/Internacion.js');

//mongoose.set('debug', true);
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
        id: {
            type: Schema.Types.ObjectId,
            ref: 'Persona'
        },
        //id: String,
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

schema.pre('validate', true, function(next, done) {
    var parent = this;

    // validamos la internacion y hacemos un populate de lo datos del paciente
    if (parent.idInternacion) {
        // buscamos la internacion correspondiente
        Internacion.findOne({
                // id: "56b23a3303f398a822467fa4"
                // id: parent.idInternacion.toString()
                id: parent.idInternacion.toString()
            }).populate('paciente', {
                apellido: true,
                nombre: true,
                documento: true,
                obrasSociales: true,
                fechaNacimiento: true,
                fechaNacimientoEstimada: true,
                sexo: true
            })
            .exec(function(err, data) {

                if (err) {
                    done(new Error("Internacion no encontrada"))
                }

                parent.paciente = {
                    id: data.paciente._id,
                    apellido: data.paciente.apellido,
                    nombre: data.paciente.nombre,
                    documento: data.paciente.documento,
                    fechaNacimiento: data.fechaNacimiento,
                    sexo: data.paciente.sexo
                };

                done();
            });

    }

    next();
});

// Config
schema.plugin(require('../common/mongoose-config'));
module.exports = mongoose.model('Cama', schema);
