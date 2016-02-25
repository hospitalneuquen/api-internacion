var User = require('../schemas/User')

// Plugin para configurar auditoría
module.exports = function(schema, options) {
    schema.add({
        createdAt: Date,
        updatedAt: Date,
        createdBy: User,
        updatedBy: User
    });

    // Define un método que debe llamarse en el documento principal antes de ejecutar .save()
    schema.methods.audit = function (user) {
        this.$audit = user;
    }

    schema.pre('save', function(next) {
        user = (this.ownerDocument && this.ownerDocument().$audit) || this.$audit;
        if (!user)
            return next(new Error("AUDIT PLUGIN ERROR: Inicialice el plugin utilizando el método audit(). Ejemplo: myModel.audit(req.user)"));

        // Todo ok...
        if (this.isNew) {
            this.createdAt = new Date();
            this.createdBy = user;
        } else {
            if (this.isModified()) {
                this.updatedAt = new Date();
                this.updatedBy = user;
            }
        }
        next();
    });
}
