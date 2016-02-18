var
    config = require('./config'),
    passport = require('passport'),
    JwtStrategy = require('passport-jwt').Strategy;
ExtractJwt = require('passport-jwt').ExtractJwt;

module.exports = function() {
    passport.serializeUser(function(user, done) {
        done(null, user);
    });

    passport.deserializeUser(function(user, done) {
        done(null, user);
    });

    // Configura JWT
    passport.use(new JwtStrategy({
            secretOrKey: config.jwt.secret,
            jwtFromRequest: ExtractJwt.fromAuthHeader()
        },
        function(jwt_payload, done) {
            done(null, jwt_payload);
        }));
}
