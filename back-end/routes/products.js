var express = require('express');
var router = express.Router();
var { QueryTypes } = require('sequelize');
var db = require("../models");
var ProductService = require('../services/ProductService');
var productService = new ProductService(db);
var { checkIfAuthorized, isAdmin } = require('./authMiddleware');


router.get('/', async function (req, res, next) {
  try {
    // #swagger.tags = ['Products']
    /* #swagger.security = [] */
    // #swagger.description = "Gets the list of all available products."
    // #swagger.produces = ['application/json']
    const products = await productService.getAllProducts();
    return res
      .status(200)
      .json({
        status: "success",
        statusCode: 200,
        message: "Products retrieved successfully",
        data: products
      });
  } catch (error) {
    console.error('Error fetching products:', error);
    return res
      .status(500)
      .json({
        status: "error",
        statusCode: 500,
        message: error.message
      });
  }
});

router.get('/admin', checkIfAuthorized, isAdmin, async function (req, res, next) {
  try {
    // #swagger.tags = ['Products']
    /* #swagger.security = [{ "bearerAuth": [] }] */
    // #swagger.description = "Gets the list of all available products(Admin only)."
    // #swagger.produces = ['application/json']
    const products = await productService.getAllProductsAdmin();
    return res
      .status(200)
      .json({
        status: 'success',
        statusCode: 200,
        data: products
      });
  } catch (err) {
    console.error('Error fetching products:', err);
    return res
      .status(500)
      .json({
        status: 'error',
        statusCode: 500,
        message: err.message || 'Failed to fetch admin product list'
      });
  }
});

router.get('/:id', async function (req, res, next) {
  try {
    // #swagger.tags = ['Products']
    /* #swagger.security = [] */
    // #swagger.description = "Gets a specific product."
    // #swagger.produces = ['application/json']
    const productId = req.params.id;
    const product = await productService.getProductById(productId);
    if (isNaN(productId)) {
      return res
        .status(400)
        .json({
          status: "error",
          statusCode: 400,
          message: "Product ID must be a number"
        });
    }
    return res
      .status(200)
      .json({
        status: "success",
        statusCode: 200,
        message: "Product retrieved successfully",
        data: product
      });
  } catch (error) {
    console.error('Error fetching product:', error);
    return res
      .status(500)
      .json({
        status: "error",
        statusCode: 500,
        message: error.message
      });
  }
});

router.get('/admin/:id', checkIfAuthorized, isAdmin, async function (req, res, next) {
  try {
    // #swagger.tags = ['Products']
    /* #swagger.security = [{ "bearerAuth": [] }] */
    // #swagger.description = "Gets a specific product(Admin only)."
    // #swagger.produces = ['application/json']
    const productId = req.params.id;
    const product = await productService.getProductByIdAdmin(productId);
    if (isNaN(productId)) {
      return res
        .status(400)
        .json({
          status: "error",
          statusCode: 400,
          message: "Product ID must be a number"
        });
    }
    return res
      .status(200)
      .json({
        status: "success",
        statusCode: 200,
        message: "Product retrieved successfully",
        data: product
      });
  } catch (error) {
    console.error('Error fetching product:', error);
    return res
      .status(500)
      .json({
        status: "error",
        statusCode: 500,
        message: error.message
      });
  }
});

router.post('/admin', checkIfAuthorized, isAdmin, async function (req, res, next) {
  try {
    // #swagger.tags = ['Products']
    /* #swagger.security = [{ "bearerAuth": [] }] */
    // #swagger.description = "Creates a new product(Admin only)."
    // #swagger.consumes = ['application/json']
    // #swagger.produces = ['application/json']
    /* #swagger.parameters['body'] =  {
      "name": "body",
      "in": "body",
        "schema": {
          $ref: "#/definitions/Product"
        }
      }
    */
    const productData = req.body;
    const result = await productService.createProduct(productData);
    return res
      .status(201)
      .json({
        status: "success",
        statusCode: 201,
        message: "Product created successfully",
        data: result
      });
  } catch (error) {
    console.error('Error creating product:', error);
    return res
      .status(500)
      .json({
        status: "error",
        statusCode: 500,
        message: error.message
      });
  }
}
);

router.put('/admin/:id', checkIfAuthorized, isAdmin, async function (req, res, next) {
  try {
    // #swagger.tags = ['Products']
    /* #swagger.security = [{ "bearerAuth": [] }] */
    // #swagger.description = "Updates a specific product(Admin only)."
    // #swagger.consumes = ['application/json']
    // #swagger.produces = ['application/json']
    /* #swagger.parameters['body'] =  {
      "name": "body",
      "in": "body",
        "schema": {
          $ref: "#/definitions/Product"
        }
      }
    */
    const productId = req.params.id;
    const productData = req.body;
    const result = await productService.updateProduct(productId, productData);
    return res
      .status(200)
      .json({
        status: "success",
        statusCode: 200,
        message: "Product updated successfully",
        data: result
      });
  } catch (error) {
    console.error('Error updating product:', error);
    return res
      .status(500)
      .json({
        status: "error",
        statusCode: 500,
        message: error.message
      });
  }
});

router.put('/admin/:id/restore', checkIfAuthorized, isAdmin, async function (req, res, next) {
  try {
    // #swagger.tags = ['Products']
    /* #swagger.security = [{ "bearerAuth": [] }] */
    // #swagger.description = "Restores a specific product(Admin only)."
    // #swagger.produces = ['application/json']
    const productId = req.params.id;
    const result = await productService.restoreProduct(productId);
    return res
      .status(200)
      .json({
        status: "success",
        statusCode: 200,
        message: "Product restored successfully",
        data: result
      });
  } catch (error) {
    console.error('Error restoring product:', error);
    return res
      .status(500)
      .json({
        status: "error",
        statusCode: 500,
        message: error.message
      });
  }
});

router.delete('/admin/:id', checkIfAuthorized, isAdmin, async function (req, res, next) {
  try {
    // #swagger.tags = ['Products']
    /* #swagger.security = [{ "bearerAuth": [] }] */
    // #swagger.description = "Soft-deletes a specific product(Admin only)."
    // #swagger.produces = ['application/json']
    const productId = req.params.id;
    const result = await productService.softDeleteProduct(productId);
    return res
      .status(200)
      .json({
        status: "success",
        statusCode: 200,
        message: "Product deleted successfully",
        data: result
      });
  } catch (error) {
    console.error('Error deleting product:', error);
    return res
      .status(500)
      .json({
        status: "error",
        statusCode: 500,
        message: error.message
      });
  }
});

module.exports = router;