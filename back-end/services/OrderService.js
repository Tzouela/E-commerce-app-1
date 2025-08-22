const { Op, where } = require('sequelize');
const crypto = require("crypto");

class OrderService {
  constructor(db) {
    this.client = db.sequelize;
    this.Order = db.Order;
    this.OrderItem = db.OrderItem;
    this.Product = db.Product;
    this.User = db.User;
    this.Membership = db.Membership;
  }

  async generateUniqueOrderNumber() {
    const makeOne = () =>
      crypto
        .randomBytes(5)
        .toString("base64")
        .replace(/[^a-zA-Z0-9]/g, "")
        .substr(0, 8);

    let orderNumber = makeOne();
    while (
      await this.Order.count({ where: { order_number: orderNumber } })
    ) {
      orderNumber = makeOne();
    }
    return orderNumber;
  }

  async createOrder(orderData, options = {}) {
    return this.Order.create(orderData, options);
  }

  async createOrderItem(itemData, options = {}) {
    return this.OrderItem.create(itemData, options);
  }

  async getOrdersForUser(userId) {
    return this.Order.findAll({
      where: { userId },
      attributes: [
        "id",
        "userId",
        "order_number",
        "total_amount",
        "status",
        "membership_capture",
        "created_at",
        "updated_at"
      ],
      include: [
        {
          model: this.OrderItem,
          attributes: [
            "id",
            "orderId",
            "productId",
            "quantity",
            "price_capture",
            "created_at",
            "updated_at"
          ],
          include: [
            {
              model: this.Product,
              attributes: {
                exclude: ["deleted_at"]
              }
            }
          ]
        }
      ],
      order: [["created_at", "DESC"]]
    });
  }

  async getOrderForUserById(orderId) {
    const fullOrder = await this.Order.findOne({
      where: { id: orderId },
      attributes: [
        "id",
        "userId",
        "order_number",
        "total_amount",
        "status",
        "membership_capture",
        "created_at",
        "updated_at"
      ],

      include: [
        {
          model: this.OrderItem,
          attributes: [
            "id",
            "orderId",
            "productId",
            "quantity",
            "price_capture",
            "created_at",
            "updated_at"
          ],
          include: [
            {
              model: this.Product,
              attributes: {
                exclude: ["deleted_at"]
              }
            }
          ]
        },
        {
          model: this.User,
          attributes: {
            exclude: ["password_hash", "salt", "deleted_at"]
          },
          include: [
            {
              model: this.Membership,
            }
          ]
        }
      ]
    });

    if (!fullOrder) {
      throw new Error("Order not found");
    }

    return fullOrder;
  }

  async getAllOrdersForAdmin() {
    return this.Order.findAll({
      attributes: [
        "id",
        "userId",
        "order_number",
        "total_amount",
        "status",
        "membership_capture",
        "created_at",
        "updated_at"
      ],
      include: [
        {
          model: this.OrderItem,
          attributes: [
            "id",
            "orderId",
            "productId",
            "quantity",
            "price_capture",
            "created_at",
            "updated_at"
          ],
          include: [
            {
              model: this.Product
            }
          ]
        },
        {
          model: this.User,
          attributes: {
            exclude: ["password_hash", "salt", "deleted_at"]
          },
          include: [
            {
              model: this.Membership,
            }
          ]
        }
      ],
      order: [["created_at", "DESC"]]
    });
  }

  async getOrderForAdminById(orderId) {
    const fullOrder = await this.Order.findOne({
      where: { id: orderId },
      attributes: [
        "id",
        "userId",
        "order_number",
        "total_amount",
        "status",
        "membership_capture",
        "created_at",
        "updated_at"
      ],

      include: [
        {
          model: this.OrderItem,
          attributes: [
            "id",
            "orderId",
            "productId",
            "quantity",
            "price_capture",
            "created_at",
            "updated_at"
          ],
          include: [
            {
              model: this.Product,
            }
          ]
        },
        {
          model: this.User,
          attributes: {
            exclude: ["password_hash", "salt", "deleted_at"]
          },
          include: [
            {
              model: this.Membership,
            }
          ]
        }
      ]
    });

    if (!fullOrder) {
      throw new Error("Order not found");
    }

    return fullOrder;
  }

  async updateOrderStatus(orderId, newStatus) {
    const order = await this.Order.findByPk(orderId);
    if (!order) throw new Error("Order not found");

    const valid = ["In progress", "Ordered", "Completed"];
    if (!valid.includes(newStatus)) throw new Error("Invalid status");

    order.status = newStatus;
    await order.save();
    return order;
  }

}

module.exports = OrderService;