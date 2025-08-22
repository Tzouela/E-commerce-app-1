var express = require('express');
var router = express.Router();
var { sequelize } = require('../models');
var { QueryTypes } = require('sequelize');


router.post('/', async function (req, res, next) {
  try {
    // #swagger.tags = ['Search']
    // #swagger.description = "Searches for a product either by fully or partially entering the name or by entering the category or brand or all three together."
    // #swagger.consumes = ['application/json']
    // #swagger.produces = ['application/json']
    /* #swagger.parameters['body'] =  {
      "name": "body",
      "in": "body",
        "schema": {
          $ref: "#/definitions/Search"
        }
      }
    */
    const { name, category, brand } = req.body;
    let joinProducts = `
      SELECT p.*,
      c.name AS category_name, 
      b.name AS brand_name
      FROM products AS p
      LEFT JOIN Categories AS c ON p.categoryId = c.id
      LEFT JOIN Brands AS b ON p.brandId = b.id
    `;

    const whereClause = [];
    const replacements = {};

    if (name) {
      whereClause.push(`p.name LIKE :name`);
      replacements.name = `%${name}%`;
    }
    if (category) {
      whereClause.push(`c.name = :category`);
      replacements.category = category;
    }
    if (brand) {
      whereClause.push(`b.name = :brand`);
      replacements.brand = brand;
    }
    if (whereClause.length) {
      joinProducts += ' WHERE ' + whereClause.join(' AND ');
    }

    const products = await sequelize.query(joinProducts, {
      replacements,
      type: QueryTypes.SELECT
    });

    return res
      .status(200)
      .json({
        status: "success",
        statusCode: 200,
        message: "Products retrieved successfully",
        count: products.length,
        products
      });
  } catch (error) {
    console.error('Error searching products:', error);
    res.status(500)
      .json({
        status: "error",
        statusCode: 500,
        message: error.message
      });
  }
});

module.exports = router;