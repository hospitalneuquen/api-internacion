var express = require('express'),
    router = express.Router(),
    CamaEstado = require('../models/CamaEstado.js');

router.get('/cama_estado/:id*?', function(req, res, next) {

    if (req.params.id) {

        CamaEstado.findOne({"idCama": req.params.id}, function(err, data) {
            if (err) {
                next(err);
                return
            }

            res.send(data);
        });
    }else{
        CamaEstado.find({}, function (err, data) {
            res.send(data);
        })

    }
});



module.exports = router;
