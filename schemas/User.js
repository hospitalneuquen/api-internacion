var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var schema = new Schema(
{
    id: {
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    given_name: String,
    family_name: String,
});

module.exports = schema;
