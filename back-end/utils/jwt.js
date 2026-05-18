const jwt = require("jsonwebtoken");
require('dotenv').config()

function signToken(user) {
  return jwt.sign(
    {
      sub: user.id,
      email: user.email,
      username: user.username,
    },
    process.env.TOKEN_SECRET,
    { expiresIn: "1h" }
  );
}

function verifyToken(token) {
  return jwt.verify(token, process.env.TOKEN_SECRET);
}

module.exports = { signToken, verifyToken };