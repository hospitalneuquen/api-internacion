var mongoose                = require('mongoose'),
    Schema                  = mongoose.Schema,
    schemaDolor             = require('./Dolor.js'),
    schemaDrenaje           = require('./Drenaje.js'),
    schemaFlebitis          = require('./Flebitis.js'),
    schemaIndicacion        = require('./Indicacion.js'),
    schemaGlasgow           = require('./Glasgow.js');
    schemaRiesgoCaidas      = require('./RiesgoCaidas.js'),
    schemaRiesgoUPP         = require('./RiesgoUPP.js'),
    schemaUbicacion         = require('./Ubicacion.js'),
    schemaTipoEvolucion     = require('./TipoEvolucion.js');

var schema = new Schema({
    idEvolucion: {
        type: Schema.Types.ObjectId,
        ref: 'Evolucion'
    },
    idIndicacion: {
        type: Schema.Types.ObjectId,
        ref: 'Indicacion'
    },
    _indicacion: schemaIndicacion, // referencia a la indicacion
    fechaHora: {
        type: Date,
        required: true,
    },
    texto: String,
    tipo: String, // cuando no se tiene idIndicacion es para indicar que servicio
    tipoIndicacion: {
        type: Schema.Types.ObjectId,
        ref: 'TipoIndicacion'
    },
    tipoEvolucion: {
        type: Schema.Types.ObjectId,
        ref: 'TipoEvolucion'
    },
    servicio: {
        type: Schema.Types.ObjectId,
        ref: 'Ubicacion'
    },
    // Valores para tipo 'enfemero'
    signosVitales: {
        pulso: Number,
        temperatura: Number,
        respiracion: Number,
        spo2: Number,
        peso: Number,
        // ****************************** Necesidad de Circulación ******************************
        circulacion: {
            tensionSistolica: Number,
            tensionDiastolica: Number,
            TA: Number,
            FC: Number,
            carotideo: Number,
            radial: Number,
            popliteo: Number,
            pedio: Number,
            observacionesCirculacion: String
        }
    },
    riesgoCaida: schemaRiesgoCaidas,
    riesgoUPP: schemaRiesgoUPP,
    glasgow: schemaGlasgow,
    dolorValoracion: schemaDolor,
    planDeHidratacionParenteral: {
        frasco: Number,
    },
    // balances liquidos
    balance: {
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
                observaciones: String,
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
            ostomias2: Number,
            residuoGastrico: Number,
            secrecionesAspiradas: Number
        },
    },
    flebitis: schemaFlebitis,
    medicamento: {
        suministrado: Boolean,
        descripcion: String,
    },
    aislamiento: {
        realizado: Boolean,
        descripcion: String,
    },
    rotarDecubito: {
        puntoApoyo: {
            type: String,
            enum: ['Derecho', 'Izquierdo']
        },
        posicion: {
            type: String,
            enum: ['Dorsal', 'Prono']
        }
    },
    otraIndicacion: {
        realizado: Boolean,
        descripcion: String,
    },
    comentarios: [{
        idPersona: {
            type: Schema.Types.ObjectId,
            ref: 'Personas'
        },
        fecha: Date,
        comentario: String
    }]
});

schema.plugin(require('../mongoose/audit'));
// schema.plugin(require('../mongoose/validar'));
schema.plugin(require('mongoose-merge-plugin')); // Por un bug(?) de mongoose no aplica el plugin global. Hay que habilitarlo acá.
module.exports = schema;
