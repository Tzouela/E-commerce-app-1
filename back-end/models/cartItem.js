module.exports = (sequelize, Sequelize) => {
  const CartItem = sequelize.define("CartItem", {
    id: {
      type: Sequelize.DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    cartId: {
      type: Sequelize.DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Carts',
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
      allowNull: false,
      defaultValue: 1
    },
    item_price: {
      type: Sequelize.DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.00
    }
  },
    {
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      indexes: [
        {
          unique: true,
          fields: ['cartId', 'productId']
        }
      ]
    });
  CartItem.associate = (models) => {
    CartItem.belongsTo(models.Cart, {
      foreignKey: 'cartId',
      onDelete: 'CASCADE'
    });
    CartItem.belongsTo(models.Product, {
      foreignKey: 'productId',
      onDelete: 'CASCADE'
    });
  };

  return CartItem;
};