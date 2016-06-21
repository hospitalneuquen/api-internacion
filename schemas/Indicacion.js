var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    schemaSolicitudPrestaciones = require('./SolicitudPrestaciones.js'),
    schemaUbicacion = require('./Ubicacion.js');

var schema = new Schema({
    // idIndicaciones hace referencia a la indicacion de la cual se modifica
    idIndicaciones: Schema.Types.ObjectId,
    fechaHora: Date,
    tipo: {
        type: String,
        // enum: [
        //     'Plan Hidratación Parenteral', 'Antibióticos', 'Heparina o profilaxis', 'Protección gástrica',
        //     'Otra medicación', 'Controles', 'Cuidados generales', 'Cuidados especiales',
        //     'Nutrición', 'Solicitud prestaciones', 'Otra indicación'
        // ]
    },
    via: String,
    frecuencia: {
        type: String,
        enum: ['24', '12', '8', '6', '4', 'unica']
    },
    // opciones para el tipo Plan Hidratación
    planHidratacion: {
        // tipoPlan: {
        //     type: String,
        //     enum: ['Parenteral', 'Enteral']
        // },
        // cantidad: String,
        // tipoSolucion: {
        //     type: String,
        //     enum: ['Solución fisiológica', 'Dextrosa', 'Ringer-Lactato']
        // },
        // soluciones: [{
        //     tipoSolucion: {
        //         type: String,
        //         enum: ['Solución fisiológica', 'Dextrosa', 'Ringer-Lactato']
        //     },
        //     dilucion: Number,
        //     cantidad: Number,
        //     // graduacion: Number
        // }],
        solucionFisiologica: {
            cantidad: Number
        },
        dextrosa: {
            cantidad: Number,
            dilucion: Number
        },
        ringerLactato: {
            cantidad: Number
        },
        cantidadFrascos: Number,
        agregados: [{
            tipoAgregado: {
                type: String,
                enum: ['Ampollas de electrolitos', 'Polivitamínicos', 'Calcio', 'Otro']
            },
            descripcion: String,
            posicion: Number,
            frascos: [Number]
        }]
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
            enum: ['Signos vitales', 'Balance', 'Diuresis', 'Peso', 'Glasgow']
        }
    },
    // opciones para el tipo Cuidados Generales
    cuidadosGenerales: {
        tipo: {
            type: String,
            // enum: ['Rotar decubito', 'Aspirar secreciones', 'Oxígeno', 'Cabecera 45º', 'Colchón aire']
        },
        oxigeno: {
            respiracion: {
                type: String,
                enum: ['Mascara', 'Bigotera']
            },
            cantidad: Number
        }
    },
    // opciones para el tipo Cuidados especiales
    cuidadosEspeciales: {
        tipo: {
            type: String,
            enum: ['Sonda', 'Aislamiento']
        },
        sonda: {
            tipo: {
                type: String,
                enum: ['SNG', 'SNY', 'Gastroenteritis', 'Ileostomías']
            },
            accion: {
                type: String,
                enum: ['Colocación', 'Limpieza', 'Extracción']
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
        }
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
            preparadoOral: Boolean
        },
        cantidadPreparadoOral: Number,
        preparadoEnteral: {
            tipoPreparado: {
                // agregar objectId de una ABM de preparados a futuro
                descripcion: String,
            },
            cantidad: Number,
            agregados: [{
                descripcion: String,
                cantidad: Number,
            }]
        },
    },
    prestaciones: schemaSolicitudPrestaciones,
    // opciones para el tipo Otro
    descripcion: String,
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
