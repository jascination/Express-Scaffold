// Node utils
var request = require('request');
var util = require('util');

// load all the things we need
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

// load up the user model
var User = require('../app/models/user');


// load the auth variables
var auth = require('./auth');

module.exports = function(passport) {

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            if(err){
                console.log(err);
            }
            done(err, user);
        });
    });

    // =========================================================================
    // GOOGLE ==================================================================
    // =========================================================================
    passport.use(new GoogleStrategy({

        clientID: auth.googleAuth.clientID,
        clientSecret: auth.googleAuth.clientSecret,
        callbackURL: auth.googleAuth.callback1
            // passReqToCallback : true // allows us to pass in the req from our route (lets us check if a user is logged in or not)

    },
    function(accessToken, refreshToken, profile, done) {

        // asynchronous

        var token = accessToken;
        var refresh = refreshToken;

        findUser();

        function findUser() {

            User.findOne({
                'google.id': profile.id
            }, function(err, user) {
                if (err) {
                    return done(err);
                }
                if (user) {

                    // if there is a user id already but no token (user was linked at one point and then removed)
                    if (!user.google.token || !user.google.refresh) {
                        user.google.id = profile.id;
                        user.google.token = token;
                        user.google.refresh = refreshToken;
                        user.google.name = profile.displayName;
                        user.google.firstName = profile._json.given_name;
                        user.google.surname = profile._json.family_name;
                        user.google.picture = profile._json.picture;
                        user.google.gender = profile._json.gender;
                        user.google.email = (profile.emails[0].value || '').toLowerCase(); // pull the first email


                        user.save(function(err) {
                            if (err)
                                return done(err);

                            return done(null, user);
                        });
                    }

                    return done(null, user);
                } else {
                    var newUser = new User();

                    newUser.google.id = profile.id;
                    newUser.google.token = token;
                    newUser.google.refresh = refreshToken;
                    newUser.google.name = profile.displayName;
                    newUser.google.firstName = profile._json.given_name;
                    newUser.google.surname = profile._json.family_name;
                    newUser.google.picture = profile._json.picture;
                    newUser.google.gender = profile._json.gender;
                    newUser.google.email = (profile.emails[0].value || '').toLowerCase(); // pull the first email
                    
                    newUser.plan = { memberSince : new Date(), type: '' };

                    newUser.save(function(err) {
                        if (err)
                            return done(err);

                        return done(null, newUser);
                    });
                }
            }); //End User FindOne
        } // End GetUser
    }));

};
