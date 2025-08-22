module.exports = (sequelize, Sequelize) => {
  const OrderItem = sequelize.define("OrderItem", {
    id: {
      type: Sequelize.DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    orderId: {
      type: Sequelize.DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Orders',
        key: 'id'
      }
    },
    productId: {
      type: Sequelize.DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Products',
        key: 'id'
      }
    },
    quantity: {
      type: Sequelize.DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 1,
    },
    price_capture: {
      type: Sequelize.DataTypes.DECIMAL(10, 2),
      allowNull: false,
    }
  },
    {
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    });
  OrderItem.associate = (models) => {
    OrderItem.belongsTo(models.Order, {
      foreignKey: 'orderId',
      onDelete: 'CASCADE'
    });
    OrderItem.belongsTo(models.Product, {
      foreignKey: 'productId',
      onDelete: 'CASCADE'
    });
  };

  return OrderItem;
};