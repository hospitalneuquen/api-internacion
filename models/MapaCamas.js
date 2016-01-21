var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    servicio: {
        type: String,
        enum: ['medica', 'quirurgica']
    },
    camas: [{
        type: Schema.Types.ObjectId,
        ref: 'Cama'
    }]

});

schema.set('toJSON', {
    virtuals: true,
    versionKey: false,
});

module.exports = mongoose.model('MapaCama', schema);
