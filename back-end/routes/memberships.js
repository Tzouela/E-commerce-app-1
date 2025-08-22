var express = require('express');
var router = express.Router();
var db = require('../models');
var MembershipService = require('../services/MembershipService');
var membershipService = new MembershipService(db);
var { checkIfAuthorized, isAdmin } = require('./authMiddleware');

router.get('/admin', checkIfAuthorized, isAdmin, async function (req, res, next) {
  try {
    // #swagger.tags = ['Memberships']
    // #swagger.description = "Gets the list of all available memberships."
    // #swagger.security = [{ bearerAuth: [] }]
    // #swagger.produces = ['application/json']
    const result = await membershipService.getAllMemberships();
    return res
      .status(200)
      .json({
        status: 'success',
        statusCode: 200,
        message: 'Memberships fetched successfully',
        data: result
      });
  } catch (error) {
    console.error('Error fetching memberships:', error);
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