var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    schemaDrenaje = require('../schemas/Drenaje.js'),
    schemaIndicacion = require('../schemas/Indicacion.js'),
    schemaUbicacion = require('../schemas/Ubicacion.js');

var schema = new Schema({
    idEvolucion: {
        type: Schema.Types.ObjectId,
        ref: 'Evolucion'
    },
    idIndicacion: {
        type: Schema.Types.ObjectId,
        ref: 'Indicacion'
    },
    fechaHora: {
        type: Date,
        required: true,
    },
    texto: String,
    tipo: {
        type: String,
        enum: ['medico', 'enfermero'],
        required: true,
    },
    servicio: {
        type: schemaUbicacion,
        required: true,
        validar: {
            modelo: require('../models/Ubicacion.js'),
            resolver: true,
        }
    },
    // Valores para tipo 'enfemero'
    signosVitales: {
        pulso: Number,
        tensionSistolica: Number,
        tensionDiastolica: Number,
        temperatura: Number,
        respiracion: Number,
        spo2: Number,
        peso: Number,
        // ****************************** Necesidad de Circulación ******************************
        circulacion: {
            TA: Number,
            FC: Number,
            carotideo: Number,
            radial: Number,
            popliteo: Number,
            pedio: Number,
            observacionesCirculacion: String
        }
    },
    // riesgo de caidas
    riesgoCaida: {
        caidasPrevias: Number,
        marcha: Number,
        ayudaDeambular: Number,
        venoclisis: Number,
        comorbilidad: Number,
        estadoMental: Number,
        total: {
            type: Number,
            default: 0
        },
    },
    // ulceras por presion
    riesgoUPP: {
        estadoFisico: Number,
        estadoMental: Number,
        actividad: Number,
        movilidad: Number,
        incontinencia: Number,
        total: { // 5-9 = Alto, 10-12 Medio, 13-16 Bajo
            type: Number,
            default: 0
        },
    },
    // glasgow
    glasgow: {
        glasgowOcular: Number,
        glasgowVerbal: Number,
        glasgowMotor: Number,
        glasgowTotal: Number
    },
    dolorValoracion: {
        analgesiaAutomedicacion: Boolean,
        ansioliticosAutomedicacion: Boolean,
        indicacionMedica: [{
            drogas: String,
            dosisDiaria: Number,
            frecuenciaDiaria: Number,
            via: {
                type: String,
                enum: ['endovenosa', 'subcutánea', 'intratecal', 'oral'],
            },
        }],
        intensidad: Number,
        punzante: Boolean,
        tipoColico: Boolean,
        pesadez: Boolean,
        pulsante: Boolean,
        caliente: Boolean,
        hormigueo: Boolean,
        descripcion: String,
        dolorLocalizacion: String,
        observacionesDolor: String,
    },
    // balances liquidos
    balance : {
        ingresos: [{
            idIndicacion: {
                type: Schema.Types.ObjectId,
                ref: 'Indicacion'
            },
            hidratacion: {
                enteral: {
                    solucionFisiologica: Number,
                    dextrosa: Number,
                    ringerLactato: Number
                },
                parenteral: {
                    solucionFisiologica: Number,
                    dextrosa: Number,
                    ringerLactato: Number
                },
                oral: {
                    cantidad: Number
                }
            },
            medicamentos: {
                descripcion: String,
                cantidad: Number
            },
            hemoterapia: {
                descripcion: String,
                cantidad: Number
            },
            nutricion: {
                enteral: {
                    cantidad: Number
                },
                soporteOral: {
                    cantidad: Number
                }
            }
            // PH: todos los planes de hidratacion
            // ATB: todos los antibioticos por EV
            // HEMO: tranfusiones sanguineas
            // NP: Nutricion parenteral: Definir
            // prep: Preparados enterales
            // h20: Plan hidratacion oral
            // Soporte oral: Nutricion->soporte oral
            // ph: Number,
            // ph2: Number,
            // atb: Number,
            // hemo: Number,
            // np: Number,
            // prep: Number,
            // h2o: Number
        }],
        egresos: {
            lavadoVesicalI: Number,
            lavadoVesicalE: Number,
            diuresis: Number,
            catarsis: Number,
            sng: Number,
            sny: Number,
            drenajes: [{
                idDrenaje: {
                    type: Schema.Types.ObjectId,
                    ref: 'Drenaje'
                },
                caracteristicaLiquido: {
                    type: String,
                    enum: ['Hemático', 'Seroso', 'Serohemático', 'Purulento']
                },
                cantidad: Number,
                observaciones: String
            }],
            // drenajes2: Number,
            ostomias: Number,
            ostomias2: Number
        },
    },
    flebitis: Boolean,
    observacionesFlebitis: String
});

schema.plugin(require('../mongoose/audit'));
schema.plugin(require('../mongoose/validar'));
schema.plugin(require('mongoose-merge-plugin')); // Por un bug(?) de mongoose no aplica el plugin global. Hay que habilitarlo acá.
module.exports = schema;
