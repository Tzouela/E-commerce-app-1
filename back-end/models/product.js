module.exports = (sequelize, Sequelize) => {
  const Product = sequelize.define("Product", {
    id: {
      type: Sequelize.DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    image_url: {
      type: Sequelize.DataTypes.STRING,
      allowNull: false
    },
    name: {
      type: Sequelize.DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: Sequelize.DataTypes.TEXT,
      allowNull: false
    },
    price: {
      type: Sequelize.DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        isDecimal: { msg: "Price must be a decimal number" },
        min: {
          args: [0.0],
          msg: "Price cannot be negative"
        }
      }
    },
    stock_quantity: {
      type: Sequelize.DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        isInt: { msg: "Stock quantity must be an integer" },
        min: {
          args: [0],
          msg: "Stock quantity cannot be negative"
        }
      }
    },
    brandId: {
      type: Sequelize.DataTypes.INTEGER,
      references: { model: 'Brands', key: 'id' },
      allowNull: false
    },
    categoryId: {
      type: Sequelize.DataTypes.INTEGER,
      references: { model: 'Categories', key: 'id' },
      allowNull: false
    },
    deleted_at: {
      type: Sequelize.DataTypes.DATE,
      allowNull: true
    }
  },
    {
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      deletedAt: "deleted_at",
      paranoid: true
    }
  );
  Product.associate = (models) => {
    Product.belongsTo(models.Category, {
      foreignKey: 'categoryId',
      onDelete: 'CASCADE'
    });
    Product.belongsTo(models.Brand, {
      foreignKey: 'brandId',
      onDelete: 'CASCADE'
    });
    Product.hasMany(models.OrderItem, {
      foreignKey: 'productId',
      onDelete: 'CASCADE'
    });
    Product.hasMany(models.CartItem, {
      foreignKey: 'productId',
      onDelete: 'CASCADE'
    });
  }

  return Product;
};