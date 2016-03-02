var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    schemaUbicacion = require('../schemas/Ubicacion.js');

var schema = new Schema({
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
    },
    // Valores para tipo 'enfemero'
    pulso: Number,
    tensionSistolica: Number,
    tensionDiastolica: Number,
    temperatura: Number,
    respiracion: Number,
    spo2: Number,
    peso: Number
});

schema.plugin(require('../mongoose/audit'));
schema.plugin(require('../mongoose/validarServicio'), true); // true indica que desea resolver el id a un objeto completo
schema.plugin(require('mongoose-merge-plugin')); // Por un bug(?) de mongoose no aplica el plugin global. Hay que habilitarlo acá.
module.exports = schema;
