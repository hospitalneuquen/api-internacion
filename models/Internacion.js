var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    Cama = require('../models/Cama.js'),
    Persona = require('../models/Persona.js'),
    Ubicacion = require('../models/Ubicacion.js'),

    schemaCama = require('../schemas/Cama.js'),
    schemaDrenaje = require('../schemas/Drenaje.js'),
    schemaEvolucion = require('../schemas/Evolucion.js'),
    schemaPase = require('../schemas/Pase.js'),
    schemaValoracionEnfermeria = require('../schemas/ValoracionEnfermeria.js'),
    schemaUbicacion = require('../schemas/Ubicacion.js');

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
            //required: true
        },
        tipo: {
            type: String,
            enum: ['ambulatorio', 'guardia', 'derivacion'],
            //required: true
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
    drenajes: [schemaDrenaje],
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
            type: schemaCama,
            // required: true,
            validar: {
                modelo: require('./Cama.js'),
                resolver: true
            }
        },
        resumenInternacion: String,
        tratamientoaSeguir: String,
        diagnosticoAlta: String,
        tipoAlta: {
            type: String,
            enum: ['medica', 'derivacion', 'voluntaria']
        },
        servicio: { // servicio desde donde se genera el egreso
            type: schemaUbicacion,
            // required: true,
            validar: {
                modelo: require('./Ubicacion.js'),
                resolver: true,
            }
        },
        // si es una derivacion especificar hacia que hospital
        // si es un pase el servicio al que se envia
        derivadoHacia: {
            type: schemaUbicacion,
            // required: true,
            validar: {
                modelo: require('./Ubicacion.js'),
                resolver: true,
            }
        }
    }

});

schema.plugin(require('../mongoose/validar'));
schema.plugin(require('../mongoose/audit'));
module.exports = mongoose.model('Internacion', schema, 'internaciones');
