var express = require('express');
var router = express.Router();
var db = require('../models');
var RoleService = require('../services/RoleService');
var MembershipService = require('../services/MembershipService');
var UserService = require('../services/UserService');
var ProductService = require('../services/ProductService');
var InitService = require('../services/InitService');

var roleService = new RoleService(db);
var membershipService = new MembershipService(db);
var userService = new UserService(db);
var productService = new ProductService(db);

var initService = new InitService(db, {
  role: roleService,
  membership: membershipService,
  user: userService,
  product: productService,
});

router.post('/', async function (req, res, next) {
  try {
    // #swagger.tags = ['Init']
    // #swagger.description = "Populates the products table from the external API that has the products data, registers an initial Admin, populates the roles tables and the memberships tables."
    // #swagger.produces = ['application/json']
    await initService.initializeDatabase();
    return res
      .status(200)
      .json({
        status: 'success',
        statusCode: 200,
        message: 'Database initialized successfully'
      });
  } catch (error) {
    console.error('Error initializing database:', error);
    return res
      .status(500)
      .json({
        status: 'error',
        statusCode: 500,
        message: error.message
      });
  }
});

module.exports = router;