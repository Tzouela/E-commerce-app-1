const { CART_STATUS } = require("../constants/statuses");

module.exports = (sequelize, Sequelize) => {
  const Cart = sequelize.define("Cart", {
    id: {
      type: Sequelize.DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    userId: {
      type: Sequelize.DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    status: {
      type: Sequelize.DataTypes.ENUM(CART_STATUS.PENDING, CART_STATUS.CHECKED_OUT),
      defaultValue: CART_STATUS.PENDING,
      allowNull: false
    }
  },
    {
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    });

  Cart.associate = (models) => {
    Cart.belongsTo(models.User, {
      foreignKey: 'userId',
      onDelete: 'CASCADE',
      unique: true
    });
    Cart.hasMany(models.CartItem, {
      foreignKey: 'cartId',
      onDelete: 'CASCADE',
    });
  };

  return Cart;
};
