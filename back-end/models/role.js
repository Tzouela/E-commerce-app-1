module.exports = (sequelize, Sequelize) => {
  const Role = sequelize.define("Role", {
    id: {
      type: Sequelize.DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    role: {
      type: Sequelize.DataTypes.ENUM,
      values: ['Admin', 'User'],
      defaultValue: 'User',
      allowNull: false,
      unique: true,

    }
  }, {
    timestamps: false
  });

  Role.associate = (models) => {
    Role.hasMany(models.User, {
      foreignKey: 'roleId',
      onDelete: 'CASCADE'
    });
  };

  return Role;
};