var express = require('express');
var router = express.Router();
var Cama = require('../models/Cama.js');
var CamaEstado = require('../models/CamaEstado.js');
var Internacion = require('../models/Internacion.js');

var ObjectId = require('mongoose').Types.ObjectId;

/**
 * @swagger
 * /cama/{id}:
 *   get:
 *     tags:
 *       - Camas
 *     summary: Devuelve una cama segun el id de la cama
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: Id de la cama
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Ok
 *       404:
 *         description: Not found
 */
router.get('/cama/:id', function(req, res, next) {
    // Devuelve una cama por id
    Cama.findOne({
        _id: req.params.id
    }, function(err, data) {
        if (err) return next(err);
        if (!data) return next(404);
        res.json(data);
    });
})

/**
 * @swagger
 * /cama/cambiarEstado/{idCama}:
 *   get:
 *     tags:
 *       - Camas
 *     summary: Devuelve una cama con los datos del ultimo estado actualizado
 *              Tambien, almacena en el historial de CamaEstado el estado completo
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: idCama
 *         description: Id de la cama a cambiar de estado
 *         in: path
 *         required: false
 *         type: integer
 *     responses:
 *       200:
 *         description: Ok
 *       404:
 *         description: No se pudo cambiar el estado de la cama
 *
 */
router.post('/cama/cambiarEstado/:idCama', function(req, res, next) {
    var error = false;

    // buscamos la cama
    Cama.findById(req.params.idCama, function(err, cama) {
        // Maneja errores en MongoDB
        if (err) return next(err);
        // Error 404: NotFound
        if (!cama) return next(404);

        if (req.body.estado == "reparacion") {
            // validamos que la cama no este ya en reparacion
            if (cama.estado == "reparacion") {
                error = true;
                res.status(500).send('La cama ya fué enviada a reparación');
            }

            // validamos que la cama no este ocupada
            if (cama.estado == "ocupada") {
                error = true;
                res.status(500).send('La cama está actualmente ocupada, no se puede enviar a reparación');
            }

            if (req.motivo == ""){
                error = true;
                res.status(400).send({status:400, message: "Debe indicar el motivo de envío a reparación", type:'internal'});
            }

            // actualizamos el estadode la cama
            cama.estado = 'reparacion';
        } else if (req.body.estado == "desocupada") {
            // verificamos si el estado anterior era en reparacion
            // y de esa forma hacemos el update sobre el historial
            // y limpiamos los campos de la reparacion
            if (cama.estado == 'reparacion' && cama.reparacion.idCamaEstado) {
                CamaEstado.findOneAndUpdate({
                    '_id': cama.reparacion.idCamaEstado
                }, {
                    'updatedAt': Date.now()
                }, function(err, _cama_estado) {
                    if (err) throw err;
                });

                cama.reparacion = {};

            }

            // actualizamos el estadode la cama
            cama.estado = 'desocupada';

            cama.paciente = undefined;
            cama.idInternacion = null;
            cama.desinfectada = false;

        } else if (req.body.estado == 'ocupada') {

            if (!cama.desinfectada) {
                error = true;
                res.status(500).send('La cama está actualmente sin desinfectar, no se puede internar a un paciente en ella.');
            }

            cama.idInternacion = req.body.idInternacion;
            cama.estado = 'ocupada';

        } else if (req.body.estado == 'desinfectada') {
            cama.desinfectada = true;
        }

        if (!error) {
            // generamos el objeto para guardar el estado en la tabla de historial
            var cama_estado = new CamaEstado({
                estado: req.body.estado,
                motivo: (req.body.motivo) ? req.body.motivo : '',
                idCama: req.params.idCama,
                idPersona: (cama.paciente.id) ? cama.paciente.id : null
            });

            // agregamos log a la cama
            cama.audit(req.user);

            if (cama.estado == 'reparacion') {
                // duplicamos y dejamos en el objeto de camas los valores
                // para la lectura de la reparacion
                cama.reparacion = {
                    idCamaEstado: cama_estado._id,
                    motivo: cama_estado.motivo,
                    //"createdAt": cama_estado.audit.createdAt
                    createdAt: new Date()
                };

            }

            cama.save(function(err, cama) {
                if (err) return next(err);

                // agregamos log al estado de la cama
                cama_estado.audit(req.user);

                cama_estado.save(function(err) {
                    if (err) return next(err);

                    if (req.body.idInternacion) {
                        //actualizamos datos de la internacion
                        Internacion.findOneAndUpdate({
                            _id: req.body.idInternacion
                        }, {
                            estado: 'ingresado'
                        }, {
                            new: true
                        }, function(err, internacion) {
                            if (err) return next(err);

                            //console.log(internacion);
                        });
                    }

                });

                res.json(cama);
            });
        }
    });

});

/**
 * @swagger
 * /cama/{idCama}/cambiarPaciente/{idPaciente}:
 *   get:
 *     tags:
 *       - Cama
 *     summary: Asignar un paciente a una camaDevuelve los estados de una cama segun el id de la cama
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: Id de la cama
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Ok
 *       404:
 *         description: Not found
 */
// router.patch('/cama/:idCama/cambiarPaciente/:idPaciente', function(req, res, next) {
//     var error = false;
//
//     // buscamos la cama
//     Cama.findById(req.params.idCama, function(err, cama) {
//         // Maneja errores en MongoDB
//         if (err) return next(err);
//         // Error 404: NotFound
//         if (!cama) return next(404);
//
//         if (!error) {
//             // generamos el objeto para guardar el estado en la tabla de historial
//             var cama_estado = new CamaEstado({
//                 estado: 'ocupada',
//                 motivo: (req.body.motivo) ? req.body.motivo : 'Cambio de paciente en cama',
//                 idCama: req.params.idCama,
//                 idPersona: (req.params.idPaciente) ? req.params.idPaciente : null
//             });
//
//             cama.audit(req.user);
//             cama.save(function(err, cama) {
//                 if (err) return next(err);
//
//                 cama_estado.save(function(err) {
//                     if (err) return next(err);
//                 });
//
//                 res.json(cama);
//             });
//         }
//     });
//
// });

/**
 * @swagger
 * /cama/pacienteInternado/{idPersona}:
 *   post:
 *     tags:
 *       - Persona
 *     summary: Indica si una persona esta actualmente internada en alguna cama
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: idPersona
 *         description: Id de la persona a cambiar a consultar si esta internada
 *         in: path
 *         required: true
 *         type: integer
 *     responses:
 *       200:
 *         description: Ok
 *       404:
 *         description: No se pudo obtener el estado de internacion del paciente
 *
 */
router.get('/cama/pacienteInternado/:idPersona', function(req, res, next) {
    var conditions = {
        'estado': 'ocupada',
        'paciente._id': req.params.idPersona
    };

    Cama.find(conditions,
        function(err, cama) {
            if (err) return next(err);
            //console.log(cama);
            res.send(cama);
        }
    );
});

module.exports = router;
