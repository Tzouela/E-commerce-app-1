module.exports = (sequelize, Sequelize) => {
  const Order = sequelize.define("Order", {
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
      },
    },
    order_number: {
      type: Sequelize.DataTypes.STRING(8),
      allowNull: false,
      unique: true
    },
    total_amount: {
      type: Sequelize.DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.00
    },
    status: {
      type: Sequelize.DataTypes.ENUM,
      values: ['Pending', 'Ordered', 'Completed'],
      defaultValue: 'Pending',
      allowNull: false
    },
    membership_capture: {
      type: Sequelize.DataTypes.STRING,
      allowNull: false
    }
  },
    {
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    });

  Order.associate = (models) => {
    Order.belongsTo(models.User, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });
    Order.hasMany(models.OrderItem, {
      foreignKey: 'orderId',
      onDelete: 'CASCADE'
    });
  };

  return Order;
};
