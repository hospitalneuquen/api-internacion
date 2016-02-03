var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    Ubicacion = require('../models/Ubicacion.js'),
    Cama = require('../models/Cama.js'),
    Persona = require('../models/Persona.js');

var schema = new Schema({
    paciente: {
        ref: 'Persona',
        type: Schema.Types.ObjectId,
        required: true
    },
    obrasSociales: [String],
    estado: {
        type: String,
        enum: ['enIngreso', 'enPase', 'ingresado', 'egresado']
    },
    ingreso: {
        fechaHora: {
            type: Date,
            required: true
        },
        tipo: {
            type: String,
            enum: ['ambulatorio', 'guardia', 'derivacion'],
            required: true
        },
        derivadoDesde: {
            ref: 'Ubicacion',
            type: Schema.Types.ObjectId,
        },
        motivo: String,
        diagnosticoPresuntivo: String,
        situacionPaciente: {
            educacion: String,
            trabajo: String,
            ocupacion: String,
        },
        antecedentes: {
            hta: Boolean,
            diabetes: Boolean,
            alergias: String,
            estiloVida: String,
            obstetricos: {
                gestas: Number,
                partos: Number,
                cesareas: Number,
                abortos: Number,
            },
            quirurgicos: String
        },
        // audit: {
        //     usuario: {
        //         id: {
        //             type: Schema.Types.ObjectId,
        //             required: true
        //         },
        //         firstName: {
        //             type: String,
        //             required: true
        //         },
        //         nombre: {
        //             type: String,
        //             required: true
        //         }
        //     },
        //     fechaHora: {
        //         type: Date,
        //         required: true
        //     },
        // }
    },
    pases: [{
        fechaHora: {
            type: Date,
            required: true
        },
        cama: {
            type: Schema.Types.ObjectId,
            ref: 'Cama'
        }
    }],
});

// Middleware: validar 'paciente'
schema.pre('validate', true, function(next, done) {
    Persona.count({
            _id: this.paciente
        },
        function(err, count) {
            if (count > 0)
                done();
            else
                done(new Error("Paciente no encontrado"))
        }
    );
    next();
});

// Middleware: validar 'pases.cama'
schema.pre('validate', true, function(next, done) {
    if (!this.pases)
        done();
    else {
        var camas = this.pases.map(function(i) {
            return i.cama
        });
        Cama.count({
                _id: {
                    $in: camas
                }
            },
            function(err, count) {
                console.log("%d %d", count, camas.length);
                if (count == camas.length)
                    done();
                else
                    done(new Error("Cama no encontrada"))
            }
        );
    }
    next();
});

// Config
schema.plugin(require('../common/mongoose-config'));
module.exports = mongoose.model('Internacion', schema, 'internaciones');
