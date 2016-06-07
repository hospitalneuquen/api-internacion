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
    schemaTratamiento = require('../schemas/Tratamiento.js'),
    schemaValoracionEnfermeria = require('../schemas/ValoracionEnfermeria.js'),
    schemaValoracionMedica = require('../schemas/ValoracionMedica.js'),
    schemaUbicacion = require('../schemas/Ubicacion.js');
    // schemaSolicitudPrestaciones = require('../schemas/SolicitudPrestaciones.js');

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
                anticoncepcion: String,
                gestas: Number,
                partos: Number,
                cesareas: Number,
                abortos: Number,
            },
            sociales: {
                primarioCompleto: Boolean,
                secundarioCompleto: Boolean,
                terciarioCompleto: Boolean,
                universitarioCompleto: Boolean,
                trabaja: Boolean,
                dondeTrabaja: String,
                obraSocial: String,
                ocupacion: String,
            },
            condicionesHabitacionales: {
                domicilio: String,
                barrio: String,
                tipoVivienda: String,   //Material, Casilla, Otra
                asentamientoToma: Boolean,
                aguaPotable: Boolean,
                electricidad: Boolean,
                cloacas: Boolean,
                gas: Boolean,
                calefaccionLenia: Boolean,
            },
            grupoFamiliarConviviente: {
                viveAcompaniado: Boolean,
                conQuienConvive: String,
                familiograma: String,
            },
            estiloVida: {
                tabaco: Boolean,
                cigarrillosXdia: String,
                fumaTiempo: String,
                alcohol: Boolean,
                consumoXdia: String,
                bebeTiempo: String,
                drogas: Boolean,
                cualesDrogas: String,
                drogaTiempo: String,
                farmacos: Boolean,
                cualesFarmacos: String,
                farmacosTiempo: String,
                actividadFisica: Boolean,
                cualActividadFisica: String,
                alimentacionSaludable: Boolean,
                dietaEspecifica: Boolean,
                cualDietaEspecifica: String,
                parejaEstable: Boolean,
                viajesRecientes: Boolean,
                viajeDonde: String,
            },
            medicacion: String,
            quirurgicos: String,
            patologicos: String,
            internaciones: String,
            catarsis: String,
            diuresis: String,
            centroSalud: String,
            familiares: [{
                familiar: String,
                problema: String,
                observaciones: String,
            }],
            alergias: [{
                tipoAlergia: String,
                alergeno: String,
                severidad: String,
                reaccion: String,
                observaciones: String,
            }],
            vacunas: [{
                nombre: String,
                aplicacion: String,
                anio: Number,
                observaciones: String,
            }]
        },
        estudiosPrevios: {
            pap: String,
            fechaSerologiaPrevia: String,
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
    // prestaciones: [schemaSolicitudPrestaciones],
    problemas: [schemaProblema],
    tratamientos: [schemaTratamiento],
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
        situacionPendiente: Boolean,
        descripcionSituacionPendiente: String,
        estadoPacienteAlta: String,
        pronosticoEvolucion: String,
        pautasAlarma: String, //Pautas de alarma y Dieta al alta son de la epicrisis de clínica quirúrgica
        dietaGeneral: Boolean,
        dietaHepatoprotectora: Boolean,
        dietaEspecial: Boolean,
        dietaSoporteNutricional: Boolean,
        // Agregar los campos de:
        // Revisar documento O2 / O3 y agregar:
        // Situacion pendiente, estado del paciente al alta, pronostico de la evolucion
        // Pautas de alarma (texto)
        // Tratamiento (texto)
        // Dieta de alta (checkbox)
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
