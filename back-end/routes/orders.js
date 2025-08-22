var express = require('express');
var router = express.Router();
var db = require("../models");
var OrderService = require("../services/OrderService");
var orderService = new OrderService(db);
var { checkIfAuthorized, isAdmin } = require("./authMiddleware");

router.get('/', checkIfAuthorized, async function (req, res, next) {
  try {
    // #swagger.tags = ['Orders']
    // #swagger.description = "Gets the list of all available orders."
    // #swagger.security = [{ bearerAuth: [] }]
    // #swagger.produces = ['application/json']
    const userId = req.user.id;
    const orders = await orderService.getOrdersForUser(userId);
    return res
      .status(200)
      .json({
        status: "success",
        statusCode: 200,
        orders
      });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return res
      .status(500)
      .json({
        status: "error",
        statusCode: 500,
        error: "Unable to fetch orders"
      });
  }
});

router.get('/admin', checkIfAuthorized, isAdmin, async function (req, res, next) {
  try {
    // #swagger.tags = ['Orders']
    // #swagger.description = "Gets the list of all available orders(Admin only)."
    // #swagger.security = [{ bearerAuth: [] }]
    // #swagger.produces = ['application/json']
    const orders = await orderService.getAllOrdersForAdmin();
    return res
      .status(200)
      .json({
        status: "success",
        statusCode: 200,
        orders
      });
  } catch (err) {
    console.error("Error fetching all orders (admin):", err);
    return res
      .status(500)
      .json({
        status: "error",
        statusCode: 500,
        message: "Unable to fetch all orders"
      });
  }
});

router.get('/:id', checkIfAuthorized, async function (req, res, next) {
  try {
    // #swagger.tags = ['Orders']
    // #swagger.description = "Gets a specific order."
    // #swagger.security = [{ bearerAuth: [] }]
    // #swagger.produces = ['application/json']
    const orderId = parseInt(req.params.id, 10);
    if (!Number.isInteger(orderId)) {
      return res
        .status(400)
        .json({
          status: "error",
          statusCode: 400,
          message: "Invalid order ID"
        });
    }

    const order = await orderService.getOrderForUserById(orderId);
    if (!order) {
      return res
        .status(404)
        .json({
          status: "error",
          statusCode: 404,
          error: "Order not found"
        });
    }
    return res
      .status(200)
      .json({
        status: "success",
        statusCode: 200,
        order
      });
  } catch (error) {
    console.error("Error fetching order:", error);
    return res
      .status(500)
      .json({
        status: "error",
        statusCode: 500,
        error: "Unable to fetch order"
      });
  }
});

router.get('/admin/:id', checkIfAuthorized, isAdmin, async function (req, res, next) {
  // #swagger.tags = ['Orders']
  // #swagger.description = "Gets a specific order(Admin only)."
  // #swagger.security = [{ bearerAuth: [] }]
  // #swagger.produces = ['application/json']
  try {
    const orderId = parseInt(req.params.id, 10);
    if (!Number.isInteger(orderId)) {
      return res
        .status(400)
        .json({
          status: "error",
          statusCode: 400,
          message: "Invalid order ID"
        });
    }

    const order = await orderService.getOrderForAdminById(orderId);
    if (!order) {
      return res
        .status(404)
        .json({
          status: "error",
          statusCode: 404,
          error: "Order not found"
        });
    }
    return res
      .status(200)
      .json({
        status: "success",
        statusCode: 200,
        order
      });
  } catch (error) {
    console.error("Error fetching order:", error);
    return res
      .status(500)
      .json({
        status: "error",
        statusCode: 500,
        error: "Unable to fetch order"
      });
  }
});

router.put('/admin/:orderId/status', checkIfAuthorized, isAdmin, async function (req, res, next) {
  try {
    // #swagger.tags = ['Orders']
    // #swagger.description = "Updates a specific order its status(Admin only)."
    // #swagger.security = [{ bearerAuth: [] }]
    // #swagger.consumes = ['application/json']
    // #swagger.produces = ['application/json']
    /* #swagger.parameters['body'] =  {
      "name": "body",
      "in": "body",
        "schema": {
          $ref: "#/definitions/OrderStatus"
        }
      }
    */
    const orderId = parseInt(req.params.orderId, 10);

    if (!Number.isInteger(orderId)) {
      return res
        .status(400)
        .json({ status: "error", message: "Invalid order ID" });
    }

    const { newStatus } = req.body;
    if (typeof newStatus !== "string") {
      return res
        .status(400)
        .json({ status: "error", statusCode: 400, message: "newStatus must be a string" });
    }

    const updated = await orderService.updateOrderStatus(orderId, newStatus);
    return res
      .status(200)
      .json({
        status: "success",
        statusCode: 200,
        message: "Order status updated",
        order: updated
      });
  } catch (error) {
    console.error("Error fetching order:", error);
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