require("dotenv").config();
const { verifyToken } = require("../utils/jwt");
var UserService = require("../services/UserService");
var db = require("../models");
var userService = new UserService(db);

async function checkIfAuthorized(req, res, next) {
  const authHeader = req.header("Authorization") || "";

  const [scheme, token] = authHeader.split(" ");
  if (scheme !== "Bearer" || !token) {
    return res
      .status(401)
      .json({ status: "error", message: "Missing or invalid Authorization header" });
  }

  try {
    const payload = verifyToken(token);

    const userId = payload.sub;
    if (!userId) {
      return res
        .status(401)
        .json({ status: "error", message: "Invalid token payload" });
    }
    const user = await userService.getOne(userId);
    if (!user) {
      return res.status(401).json({ status: "error", message: "User not found" });
    }
    req.user = {
      id: user.id,
      roleId: user.roleId,
      membershipId: user.membershipId
    };

    next();
  } catch (err) {
    console.error("JWT verification failed:", err);
    return res
      .status(401)
      .json({ status: "error", message: "Invalid or expired token" });
  }
}

const ROLE = {
  ADMIN: 1,
  USER: 2,
};

function isAdmin(req, res, next) {
  if (!req.user || req.user.roleId !== ROLE.ADMIN) {
    return res
      .status(403)
      .json({ status: "error", message: "Admins only" });
  }
  next();
}

module.exports = { checkIfAuthorized, isAdmin };


