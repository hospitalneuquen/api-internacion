var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    Ubicacion = require('../models/Ubicacion.js'),
    Cama = require('../models/Cama.js'),
    Persona = require('../models/Persona.js'),
    schemaEvolucion = require('../schemas/Evolucion.js'),
    schemaPase = require('../schemas/Pase.js'),
    schemaValoracionEnfermeria = require('../schemas/ValoracionEnfermeria.js');

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
        enfermeria: schemaValoracionEnfermeria,
        // situacionPaciente: {
        //     educacion: String,
        //     trabajo: String,
        //     ocupacion: String,
        // },
        // antecedentes: {
        //     hta: Boolean,
        //     diabetes: Boolean,
        //     alergias: String,
        //     estiloVida: String,
        //     obstetricos: {
        //         gestas: Number,
        //         partos: Number,
        //         cesareas: Number,
        //         abortos: Number,
        //     },
        //     quirurgicos: String
        // },
    },
    pases: [schemaPase],
    evoluciones: [schemaEvolucion],
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
                done(new Error("Paciente no encontrado"));
        }
    );
    next();
});

// Middleware: validar 'pases.cama'
schema.pre('validate', true, function(next, done) {
    var self = this;
    if (!self.pases || !self.pases.length)
        done();
    else {
        // Obtiene el listado de camas sin duplicados
        var camas = self.pases.map(function(i) {
            return i.cama.toString();
        });
        camas = camas.filter(function(i, pos) {
            console.log(i);
            return camas.indexOf(i) == pos;
        });

        // WTF??!?!? Pierde la referencia al modelo ????
        Cama = require('../models/Cama.js');
        Cama.count({
                _id: {
                    $in: camas
                }
            },
            function(err, count) {
                if (count == camas.length)
                    done();
                else
                    done(new Error("Cama no encontrada"));
            }
        );
    }
    next();
});

schema.plugin(require('../mongoose/audit'));
module.exports = mongoose.model('Internacion', schema, 'internaciones');
