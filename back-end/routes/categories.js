var express = require('express');
var router = express.Router();
var db = require('../models');
var CategoryService = require('../services/CategoryService');
var categoryService = new CategoryService(db);
var { checkIfAuthorized, isAdmin } = require("./authMiddleware")

router.get('/', async function (req, res, next) {
  try {
    // #swagger.tags = ['Categories']
    /* #swagger.security = [] */
    // #swagger.description = "Gets the list of all available categories."
    // #swagger.produces = ['application/json']
    const categories = await categoryService.getAllCategories();
    res
      .status(200)
      .json({
        status: 'success',
        statusCode: 200,
        message: 'Categories retrieved successfully',
        data: categories
      });
  } catch (err) {
    res
      .status(500)
      .json({
        status: 'error',
        statusCode: 500,
        message: err.message || 'An error occurred while retrieving categories'
      });
  }
});

router.get('/admin', checkIfAuthorized, isAdmin, async function (req, res, next) {
  try {
    // #swagger.tags = ['Categories']
    /* #swagger.security = [{ "bearerAuth": [] }] */
    // #swagger.description = "Gets the list of all available categories(Admin only)."
    // #swagger.produces = ['application/json']
    const categories = await categoryService.getAllCategoriesForAdmin();
    res
      .status(200)
      .json({
        status: 'success',
        statusCode: 200,
        message: 'Categories retrieved successfully',
        data: categories
      });
  } catch (err) {
    res
      .status(500)
      .json({
        status: 'error',
        statusCode: 500,
        message: err.message || 'An error occurred while retrieving categories'
      });
  }
});

router.get('/:id', async function (req, res, next) {
  try {
    // #swagger.tags = ['Categories']
    /* #swagger.security = [] */
    // #swagger.description = "Gets a specific category."
    // #swagger.produces = ['application/json']
    const categoryId = req.params.id;
    const category = await categoryService.getCategoryById(categoryId);
    if (!category) {
      return res
        .status(404)
        .json({
          status: 'error',
          statusCode: 404,
          message: `Category with ID ${categoryId} not found`
        });
    }
    res
      .status(200)
      .json({
        status: 'success',
        statusCode: 200,
        message: 'Category retrieved successfully',
        data: category
      });
  } catch (err) {
    res
      .status(500)
      .json({
        status: 'error',
        statusCode: 500,
        message: err.message || 'An error occurred while retrieving the category'
      });
  }
});

router.get('/admin/:id', checkIfAuthorized, isAdmin, async function (req, res, next) {
  try {
    // #swagger.tags = ['Categories']
    /* #swagger.security = [{ "bearerAuth": [] }] */
    // #swagger.description = "Gets a specific category(Admin only)."
    // #swagger.produces = ['application/json']
    const categoryId = req.params.id;
    const category = await categoryService.getCategoryByIdForAdmin(categoryId);
    if (!category) {
      return res
        .status(404)
        .json({
          status: 'error',
          statusCode: 404,
          message: `Category with ID ${categoryId} not found`
        });
    }
    res
      .status(200)
      .json({
        status: 'success',
        statusCode: 200,
        message: 'Category retrieved successfully',
        data: category
      });
  } catch (err) {
    res
      .status(500)
      .json({
        status: 'error',
        statusCode: 500,
        message: err.message || 'An error occurred while retrieving the category'
      });
  }
});

router.post('/admin', checkIfAuthorized, isAdmin, async function (req, res, next) {
  try {
    // #swagger.tags = ['Categories']
    /* #swagger.security = [{ "bearerAuth": [] }] */
    // #swagger.description = "Creates a new category(Admin only)."
    // #swagger.consumes = ['application/json']
    // #swagger.produces = ['application/json']
    /* #swagger.parameters['body'] =  {
      "name": "body",
      "in": "body",
        "schema": {
          $ref: "#/definitions/Category"
        }
      }
    */
    const categoryData = req.body;
    const newCategory = await categoryService.createCategory(categoryData);
    res
      .status(201)
      .json({
        status: 'success',
        statusCode: 201,
        message: 'Category created successfully',
        data: newCategory
      });
  } catch (err) {
    res
      .status(500)
      .json({
        status: 'error',
        statusCode: 500,
        message: err.message || 'An error occurred while creating the category'
      });
  }
});

router.put('/admin/:id', checkIfAuthorized, isAdmin, async function (req, res, next) {
  try {
    // #swagger.tags = ['Categories']
    /* #swagger.security = [{ "bearerAuth": [] }] */
    // #swagger.description = "Updates a specific category(Admin only)."
    // #swagger.consumes = ['application/json']
    // #swagger.produces = ['application/json']
    /* #swagger.parameters['body'] =  {
      "name": "body",
      "in": "body",
        "schema": {
          $ref: "#/definitions/Category"
        }
      }
    */
    const categoryId = req.params.id;
    const categoryData = req.body;
    const category = await categoryService.updateCategory(categoryId, categoryData);
    if (!category) {
      return res
        .status(404)
        .json({
          status: 'error',
          statusCode: 404,
          message: `Category with ID ${categoryId} not found`
        });
    }
    res
      .status(200)
      .json({
        status: 'success',
        statusCode: 200,
        message: 'Category updated successfully',
        data: category
      });
  } catch (err) {
    res
      .status(500)
      .json({
        status: 'error',
        statusCode: 500,
        message: err.message || 'An error occurred while updating the category'
      });
  }
});

router.delete('/admin/:id', checkIfAuthorized, isAdmin, async function (req, res, next) {
  try {
    // #swagger.tags = ['Categories']
    /* #swagger.security = [{ "bearerAuth": [] }] */
    // #swagger.description = "Deletes a specific category(Admin only)."
    // #swagger.produces = ['application/json']
    const categoryId = req.params.id;
    const deleted = await categoryService.deleteCategory(categoryId);
    if (!deleted) {
      return res
        .status(404)
        .json({
          status: 'error',
          statusCode: 404,
          message: `Category with ID ${categoryId} not found`
        });
    }
    res
      .status(200)
      .json({
        status: 'success',
        statusCode: 200,
        message: 'Category deleted successfully'
      });
  } catch (err) {
    res
      .status(500)
      .json({
        status: 'error',
        statusCode: 500,
        message: err.message || 'An error occurred while deleting the category'
      });
  }
});

module.exports = router;