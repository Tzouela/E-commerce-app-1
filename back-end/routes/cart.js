var express = require('express');
var router = express.Router();
var db = require("../models");
var CartService = require("../services/CartService");
const cartService = new CartService(db);
var { checkIfAuthorized } = require("./authMiddleware");

router.get('/', checkIfAuthorized, async function (req, res, next) {
  try {
    // #swagger.tags = ['Cart']
    // #swagger.description = "Gets or creates a cart for the registered user."
    // #swagger.security = [{ bearerAuth: [] }]
    // #swagger.produces = ['application/json']
    const userId = req.user.id;
    const items = await cartService.getCartForUser(userId);
    return res
      .status(200)
      .json({
        status: "success",
        statusCode: 200,
        cart: items
      });
  } catch (err) {
    console.error("Error fetching cart:", err);
    return res
      .status(500)
      .json({
        status: "error",
        statusCode: 500,
        message: "Unable to fetch cart"
      });
  }
});

router.post('/', checkIfAuthorized, async function (req, res, next) {
  try {
    // #swagger.tags = ['Cart']
    // #swagger.description = "Adds a product to teh cart of the registered user."
    // #swagger.security = [{ bearerAuth: [] }]
    // #swagger.consumes = ['application/json']
    // #swagger.produces = ['application/json']
    /* #swagger.parameters['body'] =  {
      "name": "body",
      "in": "body",
        "schema": {
          $ref: "#/definitions/Cart"
        }
      }
    */
    const userId = req.user.id;
    const { productId, quantity } = req.body;

    if (typeof productId !== "number" || typeof quantity !== "number") {
      return res
        .status(400)
        .json({
          status: "error",
          statusCode: 400,
          message: "productId and quantity must be numbers"
        });
    }

    const addedItem = await cartService.addItemToCart(userId, productId, quantity);
    return res
      .status(201)
      .json({
        status: "success",
        statusCode: 201,
        item: addedItem
      });
  } catch (err) {
    console.error("Error adding to cart:", err);
    return res
      .status(400)
      .json({
        status: "error",
        statusCode: 400,
        message: err.message
      });
  }
});

router.delete('/', checkIfAuthorized, async function (req, res) {
  try {
    // #swagger.tags = ['Cart']
    // #swagger.description = "Clears the registered user's cart."
    // #swagger.security = [{ bearerAuth: [] }]
    // #swagger.produces = ['application/json']
    const userId = req.user.id;
    const deletedCount = await cartService.clearCart(userId);
    if (deletedCount === 0) {
      return res
        .status(404)
        .json({
          status: "error",
          statusCode: 404,
          message: "No cart or cart already empty",
        });
    }
    return res
      .status(200)
      .json({
        status: "success",
        statusCode: 200,
        message: "Cart cleared"
      });
  } catch (err) {
    console.error("Error clearing cart:", err);
    return res
      .status(500)
      .json({
        status: "error",
        statusCode: 500,
        message: "Unable to clear cart"
      });
  }
});


router.post('/checkout/now', checkIfAuthorized, async function (req, res, next) {
  // #swagger.tags = ['Cart']
  // #swagger.description = "Checks out the registered user's cart and creates an order."
  // #swagger.security = [{ bearerAuth: [] }]
  // #swagger.produces = ['application/json']
  try {
    const userId = req.user.id;
    const order = await cartService.checkoutCart(userId);
    return res
      .status(201)
      .json({
        status: "success",
        statusCode: 201,
        message: "Checkout complete. Order created.",
        order: order
      });
  } catch (error) {
    console.error("Checkout error:", error);
    return res
      .status(400)
      .json({
        status: "error",
        statusCode: 400,
        error: error.message
      });
  }
});

module.exports = router;