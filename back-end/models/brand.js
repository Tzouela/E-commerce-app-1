module.exports = (sequelize, Sequelize) => {
  const Brand = sequelize.define("Brand", {
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
  Brand.associate = (models) => {
    Brand.hasMany(models.Product, {
      foreignKey: 'brandId',
      onDelete: 'CASCADE',
    });
  };

  return Brand;
};
