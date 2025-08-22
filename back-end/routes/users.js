var express = require('express');
var router = express.Router();
var db = require("../models");
var UserService = require('../services/UserService');
var userService = new UserService(db);
var { checkIfAuthorized, isAdmin } = require('./authMiddleware');


router.get('/admin', checkIfAuthorized, isAdmin, async function (req, res, next) {
  try {
    // #swagger.tags = ['Users']
    // #swagger.description = "Gets the list of all users."
    // #swagger.security = [{ bearerAuth: [] }]
    // #swagger.produces = ['application/json']
    const users = await userService.getAll();
    return res
      .status(200)
      .json({
        status: 'success',
        statusCode: 200,
        message: 'Users retrieved successfully',
        users
      });
  } catch (err) {
    return res
      .status(500)
      .json({
        status: 'error',
        statusCode: 500,
        message: err.message || 'An error occurred while retrieving users'
      });
  }
});

router.get('/admin/:userId', checkIfAuthorized, isAdmin, async function (req, res, next) {
  try {
    // #swagger.tags = ['Users']
    // #swagger.description = "Gets a specific user."
    // #swagger.security = [{ bearerAuth: [] }]
    // #swagger.produces = ['application/json']
    const userId = req.params.userId;
    const user = await userService.getOne(userId);
    if (!user) {
      return res
        .status(404)
        .json({
          status: 'error',
          statusCode: 404,
          message: 'User not found'
        });
    }
    return res
      .status(200)
      .json({
        status: 'success',
        statusCode: 200,
        user
      });
  } catch (err) {
    return res
      .status(500)
      .json({
        status: 'error',
        statusCode: 500,
        message: err.message || 'An error occurred while retrieving the user'
      });
  }
});

router.patch("/admin/:id/role", checkIfAuthorized, isAdmin, async function (req, res, next) {
  try {
    // #swagger.tags = ['Users']
    // #swagger.description = "Updates the user role(Admin only)."
    // #swagger.security = [{ bearerAuth: [] }]
    // #swagger.consumes = ['application/json']
    // #swagger.produces = ['application/json']
    /* #swagger.parameters['body'] =  {
      "name": "body",
      "in": "body",
        "schema": {
          $ref: "#/definitions/UserRole"
        }
      }
    */
    const userId = parseInt(req.params.id, 10);
    const { roleId } = req.body;

    if (!Number.isInteger(userId)) {
      return res.status(400).json({
        status: "error",
        statusCode: 400,
        message: "Invalid user ID"
      });
    }
    if (typeof roleId !== "number" && typeof roleId !== "string") {
      return res.status(400).json({
        status: "error",
        statusCode: 400,
        message: "roleId must be a number or numeric string"
      });
    }

    const newRoleId = Number(roleId);
    if (isNaN(newRoleId)) {
      return res.status(400).json({
        status: "error",
        statusCode: 400,
        message: "roleId must be a valid number"
      });
    }

    const updatedUser = await userService.changeUserRole(userId, newRoleId);

    return res.status(200).json({
      status: "success",
      statusCode: 200,
      message: "User role updated",
      data: updatedUser
    });
  } catch (err) {
    console.error("Error changing user role:", err);
    return res.status(500).json({
      status: "error",
      statusCode: 500,
      message: err.message || "Failed to change user role"
    });
  }
});

module.exports = router;
