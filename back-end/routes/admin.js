var express = require("express");
var passport = require("passport");
var jwt = require("jsonwebtoken");
require("./auth");

var router = express.Router();

router.post("/login", (req, res, next) => {
  // #swagger.tags = ['Login Admin']
  // #swagger.description = "Logs in Admins."
  // #swagger.consumes = ['application/json']
  // #swagger.produces = ['application/json']
  /* #swagger.parameters['body'] =  {
    "name": "body",
    "in": "body",
      "schema": {
        $ref: "#/definitions/Admin"
      }
    }
  */
  passport.authenticate("local", { session: false }, (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      return res.status(401).json({
        status: "error",
        statusCode: 401,
        message: info.message || "Unauthorized"
      });
    }
    if (user.roleId !== 1) {
      return res.status(403).json({
        status: "error",
        statusCode: 403,
        message: "Forbidden: Admins only"
      });
    }
    const payload = { sub: user.id, roleId: user.roleId };
    const token = jwt.sign(payload, process.env.TOKEN_SECRET, {
      expiresIn: "2h"
    });
    return res.status(200).json({
      status: "success",
      statusCode: 200,
      token
    });
  })(req, res, next);
});

module.exports = router;