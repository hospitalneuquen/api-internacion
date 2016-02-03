var express = require('express');
var router = express.Router();
var Cama = require('../models/Cama.js');
var CamaEstado = require('../models/CamaEstado.js');

var ObjectId = require('mongoose').Types.ObjectId;

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

            // actualizamos el estadode la cama
            cama.estado = 'reparacion';
        } else if (req.body.estado == "desocupada") {
            // verificamos si el estado anterior era en reparacion
            // y de esa forma hacemos el update sobre el historial
            // y limpiamos los campos de la reparacion
            if (cama.estado == 'reparacion' && cama.reparacion.idCamaEstado) {
                console.log(cama.reparacion.idCamaEstado);
                CamaEstado.findOneAndUpdate({'_id' : cama.reparacion.idCamaEstado}, {'updatedAt': Date.now()}, function(err, _cama_estado) {
                    if (err) throw err;

                    console.log(_cama_estado);
                });
                cama.reparacion = '';
            }

            // actualizamos el estadode la cama
            cama.estado = 'desocupada';
        }

        if (!error) {
            // guardamos el estado en la tabla de historial
            var cama_estado = new CamaEstado({
                'estado': req.body.estado,
                'motivo': (req.body.motivo) ? req.body.motivo : '',
                'idCama': req.params.idCama
            });

            cama_estado.save(function(err) {
                if (err) return next(err);

                // duplicamos y dejamos en el objeto de camas los valores
                // para la lectura de la reparacion
                if (cama.estado == 'reparacion') {

                    cama.reparacion = {
                        "idCamaEstado" : new ObjectId(cama_estado.id),
                        "motivo": cama_estado.motivo,
                        "createdAt": cama_estado.createdAt
                    }
                }

                cama.save(function(err, cama) {
                    if (err) return next(err);

                    res.send(cama);
                });
            });

        }
    });

});

module.exports = router;
