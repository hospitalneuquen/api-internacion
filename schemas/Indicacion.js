var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    schemaSolicitudPrestaciones = require('./SolicitudPrestaciones.js'),
    schemaUbicacion = require('./Ubicacion.js');

var schema = new Schema({
    // idIndicaciones hace referencia a la indicacion de la cual se modifica
    idIndicacion: Schema.Types.ObjectId,
    fechaHora: Date,
    tipo: {
        type: String,
        // enum: [
        //     'Plan Hidratación Parenteral', 'Antibióticos', 'Heparina o profilaxis', 'Protección gástrica',
        //     'Otra medicación', 'Controles', 'Cuidados generales', 'Cuidados especiales',
        //     'Oxigenoterapia',
        //     'Nutrición', 'Solicitud prestaciones', 'Otra indicación'
        // ]
    },
    // valores para via: SC = Subcutanea / EV = Endovenosa / VO = Via oral
    // IN = Inhalatoria / SNG = Sonda nasogastrica / IM = Intramuscular
    // TD = Transdermico
    via: String,
    frecuencia: {
        type: String,
        enum: ['24', '12', '8', '6', '4', '2', '1', 'unica', 'rescates']
    },
    // opciones para el tipo Plan Hidratación
    planHidratacion: {
        enteralParenteral: {
            tipo: {
                type: String,
                enum: ['Parenteral', 'Enteral']
            },
            solucionFisiologica: {
                cantidad: Number,
                frascos: [Number]
            },
            dextrosa: {
                cantidad: Number,
                dilucion: Number,
                frascos: [Number]
            },
            ringerLactato: {
                cantidad: Number,
                frascos: [Number]
            },
            // si es parenteral mostraremos la via
            tipoVia: {
                type: String,
                enum: ['Periférica', 'Central']
            },
            // si es parenteral mostraremos la velocidad
            velocidadInfunsion: {
                velocidad: Number,
                unidad: {
                    type: String,
                    enum: ['ml/hora', 'gotas x minuto']
                }
            },
            // si es enteral mostraremos la sonda
            sonda: {
                type: String,
                enum: ['SNG', 'SNY', 'Gastrostomías', 'Ileostomías']
            },
            // si es enteral mostrar durante cuanto tiempo se debe pasar
            pasarDurante: Number,
            agregados: [{
                tipoAgregado: {
                    type: String,
                    enum: ['Ampollas de electrolitos', 'Polivitamínicos', 'Calcio', 'Otro']
                },
                descripcion: String,
                posicion: Number,
                frascos: [Number]
            }],
            esExpansion: Boolean
        },
        oral: {
            descripcion: String,
            cantidad: Number
        }
    },
    // opciones para los tipos Heparina o profilaxis / Proteccion Gastrica / Otra medicacion / Antibióticos
    medicamento: {
        descripcion: {
            type: String
        }
    },
    // opciones para el tipo Controles
    controles: {
        tipo: {
            type: String,
            enum: ['Signos vitales', 'Balance', 'Diuresis', 'Peso', 'Glasgow', 'Ulceras por presión', 'Riesgo caídas', 'Nutrición', 'Valoración del dolor', 'Flebitis']
        }
    },
    // opciones para el tipo Cuidados Generales
    cuidadosGenerales: {
        tipo: {
            type: String,
            // enum: ['Rotar decubito', 'Aspirar secreciones', 'Oxígeno', 'Cabecera 45º', 'Colchón aire']
        },
        rotarDecubito: {
            posiciones: {
                type: String,
                enum: ['Izquierda', 'Derecha'] // TODO: Definir
            }
        }
    },
    // opciones para el tipo Cuidados especiales
    cuidadosEspeciales: {
        tipo: {
            type: String,
            enum: ['Sonda', 'Aislamiento', 'Drenajes']
        },
        sonda: {
            tipo: {
                type: String,
                enum: ['SNG', 'SNY', 'Gastrostomías', 'Ileostomías']
            },
            accion: {
                type: String,
                enum: ['Colocación', 'Limpieza', 'Extracción', 'A débito']
            }
        },
        aislamiento: {
            tipo: {
                type: String,
                enum: ['Neutropénico', 'Contacto', 'Respiratorio']
            },
            accion: {
                type: String,
                enum: ['Aislar', 'Quitar aislamiento']
            }
        },
        drenajes: {
            idDrenaje: Schema.Types.ObjectId,
            accion: {
                type: String,
                enum: ['Limpieza', 'Extracción']
            }
        }
    },
    // opciones para el tipo Oxigenoterapia
    oxigeno: {
        respiracion: {
            type: String,
            enum: ['Bigotera', 'Mascara']
        },
        cantidad: Number
    },
    // opciones para el tipo Dieta
    nutricion: {
        tipo: {
            ayuno: Boolean,
            blandoMecanico: Boolean,
            general: Boolean,
            acompanante: Boolean,
            diabetico: Boolean,
            licuado: Boolean,
            insuficienciaRenal: Boolean,
            ricoEnResiduo: Boolean,
            hepatoGastroProtectora: Boolean,
            astringente: Boolean,
            liquido01: Boolean,
            sinSal: Boolean,
            blandoSinCarne02: Boolean,
            sinGluten: Boolean,
            blandoConCarne03: Boolean,
            todoCocido: Boolean,
            individual: Boolean,
            hiperConColacion: Boolean,
            pediatrico1_2: Boolean,
            nadaPorBoca: Boolean,
            lactante1_2: Boolean,
            hipocalorico: Boolean,
            // soporteOral: Boolean
        },
        // cantidadSoporteOral: Number,
        enteral: {
            tipoPreparado: {
                // agregar objectId de una ABM de preparados a futuro
                descripcion: String,
            },
            cantidad: Number,
            velocidadInfunsion: {
                velocidad: Number,
                unidad: {
                    type: String,
                    enum: ['ml/hora', 'gotas x minuto']
                }
            },
            sonda: {
                type: String,
                enum: ['SNG', 'SNY', 'Gastrostomías', 'Ileostomías']
            }
            // agregados: [{
            //     descripcion: String,
            //     cantidad: Number,
            // }]
        },
        soporteOral: {
            tipoPreparado: {
                // agregar objectId de una ABM de preparados a futuro
                descripcion: String,
            },
            cantidad: Number,
        }
    },
    prestaciones: schemaSolicitudPrestaciones,
    // opciones para el tipo Otro
    descripcion: String,
    observacionesGenerales: String,
    posicion: Number,
    servicio: {
        type: schemaUbicacion,
        validar: {
            modelo: require('../models/Ubicacion.js'),
            resolver: true
        }
    },
    activo: {
        type: Boolean,
        default: true
    }

});


schema.plugin(require('../mongoose/audit'));
schema.plugin(require('../mongoose/validar'));
schema.plugin(require('mongoose-merge-plugin'));
module.exports = schema;