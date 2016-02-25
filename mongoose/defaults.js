// Plugin para configurar opciones por defecto en todos los schemas mongoose
module.exports = exports = function mongooseConfigPlugin(schema) {
    // Indica los campos que desea eliminar del JSON final
    var removeFields = ['_fulltext', '$audit'];

    schema.set('toJSON', {
        virtuals: true,
        versionKey: false,
        transform: function(doc, json, options) {
            for (var field in removeFields) {
                delete json[removeFields[field]];
            }
            return json;
        }
    });
}
