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
      type: Sequelize.DataTypes.ENUM,
      values: ['pending', 'checked_out'],
      defaultValue: 'pending',
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
