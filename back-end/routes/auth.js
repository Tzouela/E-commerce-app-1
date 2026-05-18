require('dotenv').config()
const express = require('express');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const crypto = require('crypto');
const { signToken } = require('../utils/jwt');
const db = require('../models');
const UserService = require('../services/UserService');
const userService = new UserService(db);

const router = express.Router();

passport.use(new LocalStrategy(
  {
    usernameField: 'username',
    passwordField: 'password'
  },
  async (username, password, done) => {
    try {
      const user = await userService.getAuthByName(username);
      if (!user) {
        return done(null, false, { message: 'Incorrect username or password.' });
      }

      crypto.pbkdf2(
        password,
        user.salt,
        310000,
        32,
        'sha256',
        (err, derivedKey) => {
          if (err) return done(err);

          let passwordsMatch = false;
          try {
            passwordsMatch = crypto.timingSafeEqual(user.password_hash, derivedKey);
          } catch (e) {
            return done(new Error('Internal auth error'));
          }

          if (!passwordsMatch) {
            return done(null, false, { message: 'Incorrect username or password.' });
          }
          return done(null, user);
        }
      );
    } catch (e) {
      return done(e);
    }
  }
));

router.post('/register', (req, res, next) => {
  // #swagger.tags = ['Register User']
  /* #swagger.security = [] */
  // #swagger.description = "Registers users."
  // #swagger.consumes = ['application/json']
  // #swagger.produces = ['application/json']
  /* #swagger.parameters['body'] =  {
    "name": "body",
    "in": "body",
      "schema": {
        $ref: "#/definitions/Register"
      }
    }
  */
  const { firstname, lastname, username, email, password, address, phone } = req.body;
  const salt = crypto.randomBytes(16);
  crypto.pbkdf2(password, salt, 310000, 32, 'sha256', async (err, hash) => {
    if (err) return next(err);
    try {
      await userService.createUser({
        firstname,
        lastname,
        username,
        email,
        salt,
        hash,
        address,
        phone
      });
      return res.status(201).json({
        status: 'success',
        statusCode: 201,
        message: 'User created. Please log in.',
        user: {
          firstname,
          lastname,
          username,
          email,
          address,
          phone
        }
      });
    } catch (e) {
      return res.status(500).json({
        status: 'error',
        message: e.message
      });
    }
  });
});


router.post('/login', (req, res, next) => {
  // #swagger.tags = ['Login']
  /* #swagger.security = [] */
  // #swagger.description = "Logs in users."
  // #swagger.consumes = ['application/json']
  // #swagger.produces = ['application/json']
  /* #swagger.parameters['body'] =  {
    "name": "body",
    "in": "body",
      "schema": {
        $ref: "#/definitions/User"
      }
    }
  */
  passport.authenticate('local', { session: false }, (err, user, info) => {
    if (err) return next(err);

    if (!user) {
      return res.status(401).json({
        status: 'error',
        statusCode: 401,
        message: info.message
      });
    }

    const token = signToken(user);

    res.status(200).json({
      status: 'success',
      statusCode: 200,
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    });
  })(req, res, next);
});

module.exports = router;