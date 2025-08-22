module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("User", {
    id: {
      type: Sequelize.DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    membershipId: {
      type: Sequelize.DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      references: {
        model: 'Memberships',
        key: 'id'
      }
    },
    roleId: {
      type: Sequelize.DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 2,
      references: {
        model: 'Roles',
        key: 'id'
      }
    },
    firstname: {
      type: Sequelize.DataTypes.STRING,
      allowNull: false,
      isEmpty: { msg: "First name cannot be empty" }
    },
    lastname: {
      type: Sequelize.DataTypes.STRING,
      allowNull: false,
      isEmpty: { msg: "Last name cannot be empty" }
    },
    username: {
      type: Sequelize.DataTypes.STRING,
      allowNull: false,
      isEmpty: { msg: "Username name cannot be empty" },
      unique: { msg: "Username already exists" }
    },
    email: {
      type: Sequelize.DataTypes.STRING,
      allowNull: false,
      unique: { msg: "Email already exists" },
      isEmail: { msg: "Must be a valid email address" },
    },
    password_hash: {
      type: Sequelize.DataTypes.BLOB,
      allowNull: false,
      isEmpty: { msg: "Password cannot be empty" }
    },
    salt: {
      type: Sequelize.DataTypes.BLOB,
      allowNull: false
    },
    address: {
      type: Sequelize.DataTypes.STRING,
      allowNull: false,
      isEmpty: { msg: "Address cannot be empty" }
    },
    phone: {
      type: Sequelize.DataTypes.STRING,
      allowNull: false,
      isNumeric: { msg: "Phone number must be numeric" },
      isEmpty: { msg: "Phone number cannot be empty" }
    },
    total_items_purchased: {
      type: Sequelize.DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    }
  }, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  User.associate = (models) => {
    User.belongsTo(models.Role, {
      foreignKey: 'roleId',
      onDelete: 'CASCADE'
    });
    User.belongsTo(models.Membership, {
      foreignKey: 'membershipId',
      onDelete: 'CASCADE'
    });
    User.hasOne(models.Cart, {
      foreignKey: 'userId',
      onDelete: 'CASCADE',
      unique: true
    });
    User.hasMany(models.Order, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });
  };

  return User;
};