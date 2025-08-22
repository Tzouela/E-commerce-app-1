var { Op, where } = require('sequelize');
var OrderService = require("./OrderService");
var UserService = require("./UserService");
var MembershipService = require("./MembershipService");

class CartService {
  constructor(db) {
    this.client = db.sequelize;
    this.Cart = db.Cart;
    this.CartItem = db.CartItem;
    this.Product = db.Product;
    this.User = db.User;
    this.OrderService = new OrderService(db);
    this.UserService = new UserService(db);
    this.MembershipService = new MembershipService(db);
  }

  async getOrCreateCart(userId) {
    let cart = await this.Cart.findOne({ where: { userId } });
    if (!cart) {
      cart = await this.Cart.create({ userId });
    }
    return cart;
  }

  async addItemToCart(userId, productId, quantity) {
    const qty = parseInt(quantity, 10);
    if (!Number.isInteger(qty) || qty <= 0) {
      throw new Error("Quantity must be a positive integer");
    }

    const cart = await this.getOrCreateCart(userId);

    const existing = await this.CartItem.findOne({
      where: { cartId: cart.id, productId }
    });

    if (existing) {
      const product = await this.Product.findByPk(productId);
      if (!product) {
        throw new Error("Product not found");
      }
      const newQuantity = existing.quantity + qty;
      if (product.stock_quantity < newQuantity) {
        throw new Error("Insufficient stock for this product");
      }
      await existing.update({ quantity: newQuantity });
      return existing;
    }

    const product = await this.Product.findByPk(productId);
    if (!product) {
      throw new Error("Product not found");
    }
    if (product.stock_quantity < qty) {
      throw new Error("Insufficient stock for this product");
    }

    const item = await this.CartItem.create({
      cartId: cart.id,
      productId,
      quantity: qty,
      item_price: product.price
    });
    return item;
  }

  async getCartForUser(userId) {
    const cart = await this.Cart.findOne({ where: { userId } });
    if (!cart) return [];

    const items = await this.CartItem.findAll({
      where: { cartId: cart.id },
      include: [
        {
          model: this.Product,
          attributes: ["id", "name", "image_url", "price", "stock_quantity"]
        }
      ]
    });

    return items.map(ci => {
      const p = ci.Product;
      return {
        productId: p.id,
        productName: p.name,
        image_url: p.image_url,
        unit_price: parseFloat(ci.item_price),
        quantity: ci.quantity,
        line_total: parseFloat((ci.item_price * ci.quantity).toFixed(2)),
        in_stock: p.stock_quantity
      };
    });
  }

  async clearCart(userId) {
    const cart = await this.Cart.findOne({ where: { userId } });
    if (!cart) return 0;
    return this.CartItem.destroy({ where: { cartId: cart.id } });
  }


  async checkoutCart(userId) {
    const t = await this.client.transaction();
    try {

      const cartRow = await this.Cart.findOne(
        { where: { userId } },
        { transaction: t }
      );

      if (!cartRow) {
        throw new Error("Your cart is empty");
      }

      const items = await this.getCartForUser(userId);
      if (items.length === 0) {
        throw new Error("Your cart is empty");
      }

      for (const ci of items) {
        if (ci.quantity > ci.in_stock) {
          throw new Error(
            `Insufficient stock for "${ci.productName}". Only ${ci.in_stock} left.`
          );
        }
      }

      const totalQuantity = items.reduce((sum, ci) => sum + ci.quantity, 0);
      const subTotal = items.reduce(
        (sum, ci) => sum + ci.unit_price * ci.quantity,
        0
      );

      const userRow = await this.UserService.getOne(userId);
      if (!userRow) {
        throw new Error("User not found");
      }
      const membershipRec = await this.MembershipService.getMembershipById(
        userRow.membershipId
      );
      if (!membershipRec) {
        throw new Error("Membership not found");
      }

      const membershipStatus = membershipRec.status;
      const discountRate = parseFloat(membershipRec.discount);

      const discountAmount =
        Math.round((subTotal * discountRate + Number.EPSILON) * 100) / 100;
      const totalAfterDiscount = parseFloat(
        (subTotal - discountAmount).toFixed(2)
      );

      const orderNumber = await this.OrderService.generateUniqueOrderNumber();
      const newOrder = await this.OrderService.createOrder(
        {
          userId,
          order_number: orderNumber,
          total_amount: totalAfterDiscount,
          status: "In progress",
          membership_capture: membershipStatus
        },
        { transaction: t }
      );

      for (const ci of items) {
        await this.OrderService.createOrderItem(
          {
            orderId: newOrder.id,
            productId: ci.productId,
            quantity: ci.quantity,
            price_capture: ci.unit_price
          },
          { transaction: t }
        );

        await this.Product.decrement(
          { stock_quantity: ci.quantity },
          { where: { id: ci.productId }, transaction: t }
        );
      }

      await this.CartItem.destroy(
        { where: { cartId: cartRow.id } },
        { transaction: t }
      );

      await this.User.increment(
        { total_items_purchased: totalQuantity },
        { where: { id: userId }, transaction: t }
      );
      await this.UserService.updateMembership(userId, { transaction: t });

      await t.commit();

      const fullOrder = await this.OrderService.Order.findOne({
        where: { id: newOrder.id },
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
            model: this.OrderService.OrderItem,
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
                model: this.MembershipService.Membership,
                attributes: {
                  exclude: ["deleted_at"]
                }
              }
            ]
          }
        ]
      });
      return fullOrder;
    } catch (error) {
      await t.rollback();
      throw error;
    }
  }
}

module.exports = CartService;