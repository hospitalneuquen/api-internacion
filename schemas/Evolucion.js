var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var schema = new Schema(
{
    fechaHora: {
        type: Date
    },
    pulso: {
        type: Number
    },
    tensionSistolica: {
        type: Number
    },
    tensionDiastolica: {
        type: Number
    },
    temperatura: {
        type: Number
    },
    respiracion: {
        type: Number
    },
    spo2: {
        type: Number
    },
    peso: {
        type: Number
    },
    texto: String,
    // tipo: {
    //     Enfermeria / Medica
    // },
    servicio: {
        id: Number, // 1='clínica médica' 2='clínica quirúrgica'
        nombre: String,
    },
});

schema.plugin(require('../mongoose/audit'));
module.exports = schema;
