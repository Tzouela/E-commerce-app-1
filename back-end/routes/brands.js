var express = require('express');
var router = express.Router();
var db = require('../models');
var BrandService = require('../services/BrandService');
var brandService = new BrandService(db);
var { checkIfAuthorized, isAdmin } = require("./authMiddleware")

router.get('/', async function (req, res, next) {
  try {
    // #swagger.tags = ['Brands']
    /* #swagger.security = [] */
    // #swagger.description = "Gets the list of all available brands."
    // #swagger.produces = ['application/json']
    const result = await brandService.getAllBrands();
    res
      .status(200)
      .json({
        status: 'success',
        statusCode: 200,
        message: 'Brands retrieved successfully',
        data: result
      });
  } catch (error) {
    console.error('Error fetching brands:', error);
    res
      .status(500)
      .json({
        status: 'error',
        message: 'Failed to fetch brands'
      });
  }
});

router.get('/admin', checkIfAuthorized, isAdmin, async function (req, res, next) {
  try {
    // #swagger.tags = ['Brands']
    /* #swagger.security = [{ "bearerAuth": [] }] */
    // #swagger.description = "Gets the list of all available brands(Admin only)."
    // #swagger.produces = ['application/json']
    const result = await brandService.getAllBrandsForAdmin();
    res
      .status(200)
      .json({
        status: 'success',
        statusCode: 200,
        message: 'Brands retrieved successfully',
        data: result
      });
  } catch (error) {
    console.error('Error fetching brands:', error);
    res
      .status(500)
      .json({
        status: 'error',
        message: 'Failed to fetch brands'
      });
  }
});

router.get('/:id', async function (req, res, next) {
  try {
    // #swagger.tags = ['Brands']
    /* #swagger.security = [] */
    // #swagger.description = "Gets a specific brand."
    // #swagger.produces = ['application/json']
    const brandId = req.params.id;
    const brand = await brandService.getBrandById(brandId);
    if (!brand) {
      return res
        .status(404)
        .json({
          status: 'error',
          statusCode: 404,
          message: `Brand with ID ${brandId} not found`
        });
    }
    res
      .status(200)
      .json({
        status: 'success',
        statusCode: 200,
        message: 'Brand retrieved successfully',
        data: brand
      });
  } catch (err) {
    res
      .status(500)
      .json({
        status: 'error',
        statusCode: 500,
        message: err.message || 'An error occurred while retrieving the brand'
      });
  }
});

router.get('/admin/:id', checkIfAuthorized, isAdmin, async function (req, res, next) {
  try {
    // #swagger.tags = ['Brands']
    /* #swagger.security = [{ "bearerAuth": [] }] */
    // #swagger.description = "Gets a specific brand(Admin only)."
    // #swagger.produces = ['application/json']
    const brandId = req.params.id;
    const brand = await brandService.getBrandByIdForAdmin(brandId);
    if (!brand) {
      return res
        .status(404)
        .json({
          status: 'error',
          statusCode: 404,
          message: `Brand with ID ${brandId} not found`
        });
    }
    res
      .status(200)
      .json({
        status: 'success',
        statusCode: 200,
        message: 'Brand retrieved successfully',
        data: brand
      });
  } catch (err) {
    res
      .status(500)
      .json({
        status: 'error',
        statusCode: 500,
        message: err.message || 'An error occurred while retrieving the brand'
      });
  }
});

router.post('/admin', checkIfAuthorized, isAdmin, async function (req, res, next) {
  try {
    // #swagger.tags = ['Brands']
    /* #swagger.security = [{ "bearerAuth": [] }] */
    // #swagger.description = "Creates a new brand(Admin only)."
    // #swagger.consumes = ['application/json']
    // #swagger.produces = ['application/json']
    /* #swagger.parameters['body'] =  {
      "name": "body",
      "in": "body",
        "schema": {
          $ref: "#/definitions/Brand"
        }
      }
    */
    const brandData = req.body;
    const newBrand = await brandService.createBrand(brandData);
    res
      .status(201)
      .json({
        status: 'success',
        statusCode: 201,
        message: 'Brand created successfully',
        data: newBrand
      });
  } catch (err) {
    res
      .status(500)
      .json({
        status: 'error',
        statusCode: 500,
        message: err.message || 'An error occurred while creating the brand'
      });
  }
});

router.put('/admin/:id', checkIfAuthorized, isAdmin, async function (req, res, next) {
  try {
    // #swagger.tags = ['Brands']
    /* #swagger.security = [{ "bearerAuth": [] }] */
    // #swagger.description = "Updates a specific brand(Admin only)."
    // #swagger.consumes = ['application/json']
    // #swagger.produces = ['application/json']
    /* #swagger.parameters['body'] =  {
      "name": "body",
      "in": "body",
        "schema": {
          $ref: "#/definitions/Brand"
        }
      }
    */
    const brandId = req.params.id;
    const brandData = req.body;
    const brand = await brandService.updateBrand(brandId, brandData);
    if (!brand) {
      return res
        .status(404)
        .json({
          status: 'error',
          statusCode: 404,
          message: `Brand with ID ${brandId} not found`
        });
    }
    res
      .status(200)
      .json({
        status: 'success',
        statusCode: 200,
        message: 'Brand updated successfully',
        data: brand
      });
  } catch (err) {
    res
      .status(500)
      .json({
        status: 'error',
        statusCode: 500,
        message: err.message || 'An error occurred while updating the brand'
      });
  }
});

router.delete('/admin/:id', checkIfAuthorized, isAdmin, async function (req, res, next) {
  try {
    // #swagger.tags = ['Brands']
    /* #swagger.security = [{ "bearerAuth": [] }] */
    // #swagger.description = "Deletes a specific brand(Admin only)."
    // #swagger.produces = ['application/json']
    const brandId = req.params.id;
    const deleted = await brandService.deleteBrand(brandId);
    if (!deleted) {
      return res
        .status(404)
        .json({
          status: 'error',
          statusCode: 404,
          message: `Brand with ID ${brandId} not found`
        });
    }
    res
      .status(200)
      .json({
        status: 'success',
        statusCode: 200,
        message: 'Brand deleted successfully'
      });
  } catch (err) {
    res
      .status(500)
      .json({
        status: 'error',
        statusCode: 500,
        message: err.message || 'An error occurred while deleting the brand'
      });
  }
});

module.exports = router;