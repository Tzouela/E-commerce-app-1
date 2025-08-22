module.exports = (sequelize, Sequelize) => {
  const Category = sequelize.define("Category", {
    id: {
      type: Sequelize.DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: Sequelize.DataTypes.STRING,
      allowNull: false,
      unique: true
    }
  },
    {
      timestamps: false
    });
  Category.associate = (models) => {
    Category.hasMany(models.Product, {
      foreignKey: 'categoryId',
      onDelete: 'CASCADE'
    });
  };

  return Category;
};
