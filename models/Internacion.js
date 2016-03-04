var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    Ubicacion = require('../models/Ubicacion.js'),
    Persona = require('../models/Persona.js'),
    schemaEvolucion = require('../schemas/Evolucion.js'),
    schemaPase = require('../schemas/Pase.js'),
    schemaValoracionEnfermeria = require('../schemas/ValoracionEnfermeria.js');

var schema = new Schema({
    paciente: {
        ref: 'Persona',
        type: Schema.Types.ObjectId,
        required: true,
        validar: require('./Persona.js'),
    },
    obrasSociales: [String],
    estado: {
        type: String,
        enum: ['enIngreso', 'enPase', 'ingresado', 'egresado']
    },
    ingreso: {
        fechaHora: {
            type: Date,
            required: true
        },
        tipo: {
            type: String,
            enum: ['ambulatorio', 'guardia', 'derivacion'],
            required: true
        },
        derivadoDesde: {
            ref: 'Ubicacion',
            type: Schema.Types.ObjectId,
        },
        motivo: String,
        diagnosticoPresuntivo: String,
        enfermeria: schemaValoracionEnfermeria,
        // situacionPaciente: {
        //     educacion: String,
        //     trabajo: String,
        //     ocupacion: String,
        // },
        // antecedentes: {
        //     hta: Boolean,
        //     diabetes: Boolean,
        //     alergias: String,
        //     estiloVida: String,
        //     obstetricos: {
        //         gestas: Number,
        //         partos: Number,
        //         cesareas: Number,
        //         abortos: Number,
        //     },
        //     quirurgicos: String
        // },
    },
    pases: [schemaPase],
    evoluciones: [schemaEvolucion],
    egreso: {
        fechaHora: {
            type: Date,
            // required: true
        },
        tipo: {
            type: String,
            enum: ['alta', 'defuncion'],
            // required: true
        },
        descripcion: String,
        cama: {
            type: Schema.Types.ObjectId,
            ref: 'Cama',
            // required: true
        }
    }
});

schema.plugin(require('../mongoose/validar'));
schema.plugin(require('../mongoose/audit'));
module.exports = mongoose.model('Internacion', schema, 'internaciones');
