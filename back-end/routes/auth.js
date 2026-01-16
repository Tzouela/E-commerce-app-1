require('dotenv').config()
var express = require('express');
var passport = require('passport');
var LocalStrategy = require('passport-local');
var jwt = require('jsonwebtoken');
var crypto = require('crypto');
var db = require('../models');
var UserService = require('../services/UserService');
var userService = new UserService(db);

var router = express.Router();

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

passport.serializeUser((user, cb) => cb(null, user.id));
passport.deserializeUser(async (id, cb) => {
  try {
    const user = await userService.getOneByName(id);
    cb(null, user);
  } catch (e) {
    cb(e);
  }
});

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

    const payload = ({
      sub: user.id,
      email: user.email,
      username: user.username
    });

    const token = jwt.sign(payload, process.env.TOKEN_SECRET, { expiresIn: '2h' });

    res.status(200).json({
      status: 'success',
      statusCode: 200,
      message: 'Login successful',
      token,
      payload
    });
  })(req, res, next);
});

module.exports = router;