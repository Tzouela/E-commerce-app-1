var express = require('express');
var router = express.Router();
var db = require('../models');
var RoleService = require('../services/RoleService');
var roleService = new RoleService(db);
var { checkIfAuthorized, isAdmin } = require('./authMiddleware');

router.get('/admin', checkIfAuthorized, isAdmin, async function (req, res, next) {
  try {
    // #swagger.tags = ['Roles']
    // #swagger.description = "Gets the list of all available roles."
    // #swagger.security = [{ bearerAuth: [] }]
    // #swagger.produces = ['application/json']
    const result = await roleService.getAllRoles();
    return res
      .status(200)
      .json({
        status: 'success',
        statusCode: 200,
        message: 'Roles fetched successfully',
        data: result
      });
  } catch (error) {
    console.error('Error fetching roles:', error);
    return res
      .status(500)
      .json({
        status: 'error',
        statusCode: 500,
        message: 'Internal Server Error'
      });
  }
});

module.exports = router;