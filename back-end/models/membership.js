module.exports = (sequelize, Sequelize) => {
  const Membership = sequelize.define("Membership", {
    id: {
      type: Sequelize.DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    status: {
      type: Sequelize.DataTypes.ENUM,
      values: ['Bronze', 'Silver', 'Gold'],
      defaultValue: 'Bronze',
      allowNull: false,
      unique: true
    },
    min_quantity: {
      type: Sequelize.DataTypes.INTEGER,
      allowNull: true
    },
    max_quantity: {
      type: Sequelize.DataTypes.INTEGER,
      allowNull: true
    },
    discount: {
      type: Sequelize.DataTypes.DECIMAL(5, 2),
      allowNull: false,
      defaultValue: 0.00
    },
  }, {
    timestamps: false
  });

  Membership.associate = models => {
    Membership.hasMany(models.User, {
      foreignKey: 'membershipId',
      onDelete: 'CASCADE',
      as: 'users'
    });
  };
  return Membership;
};