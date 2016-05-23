var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    schemaUbicacion = require('./Ubicacion.js');

var schema = new Schema({
    fecha: {
        type: Date,
        //required: true,
    },
    indicaciones: [{
        tipo: {
            type: String,
            enum: ['Plan Hidratación', 'Heparina o profilaxis', 'Protección gástrica', 'Otra medicación', 'Otra indicación']
        },
        descripcion: {
            type: String,
            //required: true,
        },
        via: String,
        frecuencia: {
            type: String,
            enum: ['24', '12', '8', '6', '4', 'unica'],
        }
    }],
    /************ Controles **************/
    controlSignosVitales: Boolean,
    frecuenciaSignosVitales: String,
    controlDiuresis: Boolean,
    frecuenciaDiuresis: String,
    controlPeso: Boolean,
    frecuenciaPeso: String,
    controlGlasgow: Boolean,
    frecuenciaGlasgow: String,
    /************ Cuidados generales **************/
    rotarDecubito: Boolean,
    frecuenciaRotarDecubito: String,
    aspirarSecreciones: Boolean,
    frecuenciaAspirarSecreciones: String,
    kinesiologia: Boolean,
    frecuenciaKinesiologia: String,
    oxigeno: Boolean,
    frecuenciaOxigeno: String,
    /************ Cuidados especiales **************/
    SNG: Boolean,
    cualSNG: String,
    sondaVesical: Boolean,
    aislamiento: Boolean,
    cualAislamiento: String,
    /************ Dieta **************/
    dietaAyuno: Boolean,
    dietaBlandoMecanico: Boolean,
    dietaGeneral: Boolean,
    dietaAcompanante: Boolean,
    dietaDiabetico: Boolean,
    dietaLicuado: Boolean,
    dietaInsuficienciaRenal: Boolean,
    dietaRicoEnResiduo: Boolean,
    dietaHepatoGastroProtectora: Boolean,
    dietaAstringente: Boolean,
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
    /************ Cuidados especiales **************/
    tipoPreparadoEnteral: String,
    volumen24hs: String,
    cantidadDeTomas: String,
    servicio: {
        type: schemaUbicacion,
        validar: {
            modelo: require('../models/Ubicacion.js'),
            resolver: true
        }
    }
});

schema.plugin(require('../mongoose/audit'));
schema.plugin(require('../mongoose/validar'));
schema.plugin(require('mongoose-merge-plugin'));
module.exports = schema;
