var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    Cama = require('../models/Cama.js'),
    Persona = require('../models/Persona.js'),
    Ubicacion = require('../models/Ubicacion.js'),

    schemaAntecedenteBinario = require('../schemas/AntecedenteBinario.js'),
    schemaCama = require('../schemas/Cama.js'),
    schemaDrenaje = require('../schemas/Drenaje.js'),
    schemaDiagnostico = require('../schemas/Diagnostico.js'),
    schemaEvolucion = require('../schemas/Evolucion.js'),
    schemaPase = require('../schemas/Pase.js'),
    schemaProblema = require('../schemas/Problema.js'),
    schemaValoracionEnfermeria = require('../schemas/ValoracionEnfermeria.js'),
    schemaValoracionMedica = require('../schemas/ValoracionMedica.js'),
    schemaUbicacion = require('../schemas/Ubicacion.js');
    schemaSolicitudPrestaciones = require('../schemas/SolicitudPrestaciones.js');

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
        medico: schemaValoracionMedica,
        antecedentes: {
            binarios: [{
                antecedente: schemaAntecedenteBinario,
                activo: Boolean,
                observaciones: String,
            }],
            ginecoobstetricos: {
                gestas: Number,
                partos: Number,
                cesareas: Number,
                abortos: Number,
            },
            medicacion: String,
            quirurgicos: String,
            familiares: String,
        },
        estudiosPrevios: {
            pap: String,
            mamografia: String,
            otros: String,
        },
        // situacionPaciente: {
        //     educacion: String,
        //     trabajo: String,
        //     ocupacion: String,
        // },
    },
    pases: [schemaPase],
    drenajes: [schemaDrenaje],
    evoluciones: [schemaEvolucion],
    prestaciones: [schemaSolicitudPrestaciones],
    problemas: [schemaProblema],
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
        resumenInternacion: String,
        tratamientoaSeguir: String,
        diagnosticoAlta: [schemaDiagnostico],
        // diagnosticoAlta: [{
        //     type: schemaDiagnostico,
        //     validar: {
        //         modelo: require('./Diagnostico.js'),
        //         resolver: true
        //     }
        // }],
        tipoAlta: {
            type: String,
            enum: ['medica', 'derivacion', 'voluntaria']
        },
        // si es una derivacion especificar hacia que hospital
        derivadoHacia: schemaUbicacion
        // derivadoHacia: {
        //     type: schemaUbicacion,
        //     validar: {
        //         modelo: require('./Ubicacion.js'),
        //         resolver: true
        //     }
        // }
    }

});

schema.plugin(require('../mongoose/validar'));
schema.plugin(require('../mongoose/audit'));
module.exports = mongoose.model('Internacion', schema, 'internaciones');
