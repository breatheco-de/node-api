// We need these.
const passport = require('passport')
var JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;

var opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: 'secret',
    issuer: 'accounts.examplesoft.com',
    audience: 'yoursite.net'
}

passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
    console.log(jwt_payload);
    // User.findOne({id: jwt_payload.sub}, function(err, user) {
    //     if (err) {
    //         return done(err, false);
    //     }
    //     if (user) {
            return done(null, {
                id: 1,
                username: "alex"
            });
        // } else {
        //     return done(null, false);
        //     // or you could create a new account
        // }
    // })
}))

/*
    The next 2 functions are required to be
    defined by passport. Let us not worry about
    them for now.
*/
passport.serializeUser(function(user, done) {
    console.log("Serialization");
  done(null, user)
})

passport.deserializeUser(function(user, done) {
    console.log("De-serialization");
  done(null, user)
})

module.exports = {
    passport,
    middlewares: [
        passport.initialize(),
        passport.session()
    ]
}
