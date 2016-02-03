var express = require('express'),
    router = express.Router(),
    CamaEstado = require('../models/CamaEstado.js');

router.get('/cama_estado/:id*?', function(req, res, next) {

    if (req.params.id) {

        CamaEstado.findOne({"idCama": req.params.id}, function(err, data) {
            // Maneja errores en MongoDB
        	if (err) return next(err);
        	// Error 404: NotFound
        	if (!data) return next(404);

            res.send(data);
        });
    }else{
        CamaEstado.find({}, function (err, data) {
            res.send(data);
        })

    }
});



module.exports = router;
