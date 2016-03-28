var express = require('express'),
    router = express.Router(),
    AntecedenteTipo = require('../models/AntecedenteTipo.js'),
    Antecedente = require('../models/Antecedente.js');

/**
 * @swagger
 * /antecedente_tipo/{id}:
 *   get:
 *     tags:
 *       - Antecedente
 *     summary: Devuelve los antecedentes segun el id
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: idAntecedenteTipo
 *         description: Id del tipo de antecedente
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Ok
 *       404:
 *         description: Not found
 */
router.get('/antecedente', function(req, res, next) {
    // console.log(req.params.id);
    Antecedente.find({
        // _id: req.params.id
    }, function(err, data) {

        if (err) return next(err);
        if (!data) return next(404);
        res.json(data);
    });
});

router.get('/antecedente/:id', function(req, res, next) {
    Antecedente.findOne({
            _id: req.params.id
        })
        .exec(function(err, data) {
            if (err) return next(err);
            if (!data) return next(404);
            res.json(data);
        });
});

module.exports = router;
