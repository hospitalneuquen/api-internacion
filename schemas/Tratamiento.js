var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    schemaUbicacion = require('./Ubicacion.js');

var schema = new Schema({
    fecha: {
        type: Date,
        //required: true,
    },
    indicaciones: [{
        // idIndicaciones hace referencia a la indicacion de la cual se modifica
        idIndicaciones: Schema.Types.ObjectId,
        fechaHora: Date,
        tipo: {
            type: String,
            enum: [
                'Plan Hidratación', 'Heparina o profilaxis', 'Protección gástrica',
                'Otra medicación', 'Controles', 'Cuidados generales', 'Cuidados especiales',
                'Dieta', 'Solicitud prestaciones', 'Otra indicación'
            ]
        },
        via: String,
        frecuencia: {
            type: String,
            enum: ['24', '12', '8', '6', '4', 'unica']
        },
        // opciones para el tipo Plan Hidratación
        planHidratacion: {
            tipoPlan: {
                type: String,
                enum: ['Parenteral', 'Enteral']
            },
            cantidad: String,
            tipoSolucion: {
                type: String,
                enum: ['Solución fisiológica', 'Dextrosa', 'Ringer-Lactato']
            },
            agregados: [{
                tipoAgregado:{
                    type: String,
                    enum: ['Ampollas de electrolitos', 'Polivitamínicos', 'Calcio', 'Otro']
                },
                descripcion: String,
                posicion: Number

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
            // signosVitales: Boolean,
            // diuresis: Boolean,
            // peso: Boolean,
            // glasgow: Boolean
        },
        // opciones para el tipo Cuidados Generales
        cuidadosGenerales: {
            tipo: {
                type: String,
                enum: ['Rotar decubito', 'Aspirar secreciones', 'Kinesiología', 'Oxígeno', 'Cabecera 45º', 'Colchón aire']
            }
            // rotarDecubito: Boolean,
            // aspirarSecreciones: Boolean,
            // kinesiologia: Boolean,
            // oxigeno: Boolean
        },
        // opciones para el tipo Cuidados especiales
        cuidadosEspeciales: {
            SNG: Boolean,
            cualSNG: String,
            sondaVesical: Boolean,
            aislamiento: Boolean,
            cualAislamiento: String
        },
        // opciones para el tipo Dieta
        dieta: {
            // type: String,
            // enum: [
            //         'Ayuno', 'Blando mecánico', 'General', 'Acompañanate',
            //         'Diabético', 'Licuado', 'Insuficencia Renal', 'Rico en residuo',
            //         'Hepato/Gastro protectora', 'Astringente', 'Líquido 01', 'Sin sal',
            //         'Sin gluten', 'Blando sin carne 02', 'Blando con carne 03', 'Todo cocido',
            //         'Individual', 'Hiper c/colación', 'Pediátrico 1 - 2', 'Nada por boca',
            //         'Lactante 1 - 2', 'Hipocalórico'
            //     ]
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
            },
            preparadoEnteral: {
                tipoPreparadoEnteral: String,
                volumen24hs: String,
                cantidadDeTomas: String
            },
        },
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

    }],

});

schema.plugin(require('../mongoose/audit'));
schema.plugin(require('../mongoose/validar'));
schema.plugin(require('mongoose-merge-plugin'));
module.exports = schema;
