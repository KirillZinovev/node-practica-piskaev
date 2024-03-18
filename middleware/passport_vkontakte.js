const VKontakteStrategy = require("passport-vkontakte").Strategy;
const User = require("../models/user");
const logger = require("../logger");
const passport = require('passport');
const express = require('express');
require("dotenv").config();

function passportFunction(passport) {
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        User.findById(id)
            .then(function (user) {
                done(null, user);
            })
            .catch(done);
    });

    passport.use(new VKontakteStrategy({
        clientID: process.env.VK_CLIENT_ID,
        clientSecret: process.env.VK_CLIENT_SECRET,
        callbackURL: "http://localhost:3000/auth/vkontakte/callback",
    },
    function(accessToken, refreshToken, params, profile, done) {
        User.findOne({ vkontakteId: profile.id })
            .then(existingUser => {
                if (existingUser) {
                    return done(null, existingUser);
                } else {
                    const newUser = new User({
                        vkontakteId: profile.id,
                        username: profile.displayName,
                        // Другие данные профиля пользователя из VKontakte
                    });
                    newUser.save()
                        .then(user => {
                            done(null, user);
                        })
                        .catch(err => {
                            logger.error("Error saving new user:", err);
                            done(err, false);
                        });
                }
            })
            .catch(err => {
                logger.error("Error finding user in database:", err);
                done(err, false);
            });
    }));
}

module.exports = passportFunction;
