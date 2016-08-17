var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var schema = new Schema({
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
    dolorManifestacionEnfermeria: String,
    dolorCaracteristicasEnfermeria: String,
    dolorIntensidadEnfermeria: String,
    intervencion: Boolean,
    evaluacion: Boolean,
    dolorManifestacionMedica: String,
    dolorCaracteristicasMedica: String,
    dolorIntensidadMedica: String,
    dolorAvisa: String,
    dolorAcude: String,
    informaAnalgesico: Boolean,
    dolorDisminuye: Boolean,
    dolorProvoca: String,
    descansaNoche: Boolean,
    observacionesDolor: String
});

schema.plugin(require('../mongoose/audit'));
schema.plugin(require('../mongoose/validar'));
schema.plugin(require('mongoose-merge-plugin'));
module.exports = schema;
