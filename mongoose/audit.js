var User = require('../schemas/User')

// Plugin para configurar auditoría
module.exports = function(schema, options) {
    schema.add({
        createdAt: {
            type: Date,
            mergeable: false
        },
        createdBy: {
            type: User,
            mergeable: false
        },
        updatedAt: {
            type: Date,
            mergeable: false
        },
        updatedBy: {
            type: User,
            mergeable: false
        }
    });

    // Define un método que debe llamarse en el documento principal antes de ejecutar .save()
    schema.methods.audit = function(user) {
        this.$audit = user;
    }

    schema.pre('save', function(next) {
        var user = this.$audit;
        var o = this.ownerDocument && this.ownerDocument();
        while (o && !user) {
            user = o.$audit;
            o = o.ownerDocument && o.ownerDocument();
        }

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
