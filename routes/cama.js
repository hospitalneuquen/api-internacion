var express = require('express');
var router = express.Router();
var Cama = require('../models/Cama.js');

var ObjectId = require('mongoose').Types.ObjectId;

router.post('/cama/cambiarEstado/:idCama', function(req, res, next) {
    var id = new ObjectId(req.params.idCama);
    var error = false;

    // buscamos la cama
    Cama.findById(id, function(err, cama){
        if (req.body.estado == "reparacion") {
            if (err) {
                next(err);
                return
            }

            // validamos que la cama no este ya en reparacion
            if (cama.estado == "reparacion"){
                error = true;
                res.status(500).send('La cama ya fué enviada a reparación');
            }

            // validamos que la cama no este ocupada
            if (cama.estado == "ocupada"){
                error = true;
                res.status(500).send('La cama está actualmente ocupada, no se puede enviar a reparación');
            }

            // actualizamos el estadode la cama
            cama.estado = 'reparacion';
        }else if (req.body.estado == "desocupada") {
            // actualizamos el estadode la cama
            cama.estado = 'desocupada';
        }

        if (!error){
            cama.save(function (err) {
                if (err) return next(err);

                res.send(cama);
            });
            // Cama.update({ _id: id }, {
            //     $set: $update
            // }, function(err, data){
            //     if (err){
            //         next(err);
            //         return;
            //     }
            //
            //     return res.json(Cama);
            // });
        }
    });

    // //var query = Mapa.find({"servicio.id": req.params.idServicio});
    // var query = Mapa.find({});
    // if (req.params.idServicio)
    //     query.where('servicio.id').equals(req.params.idServicio);
    // // else {
    // //     query.limit(10);
    // // }
    // query.exec(function(err, data) {
    //     res.json(data);
    // });
});

module.exports = router;
