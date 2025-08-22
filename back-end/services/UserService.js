require('dotenv').config();
var { Op } = require('sequelize');
var crypto = require('crypto');

class UserService {
  constructor(db) {
    this.client = db.sequelize;
    this.User = db.User;
    this.Role = db.Role;
    this.Membership = db.Membership;
  }

  async createInitialAdmin(options = {}) {
    const salt = crypto.randomBytes(16);
    const password_hash = crypto.pbkdf2Sync(
      process.env.ADMIN_UI_PASSWORD,
      salt,
      310000,
      32,
      'sha256'
    );
    return this.User.create({
      firstname: process.env.ADMIN_UI_FIRST_NAME,
      lastname: process.env.ADMIN_UI_LAST_NAME,
      username: process.env.ADMIN_UI_USERNAME,
      email: process.env.ADMIN_UI_EMAIL,
      password_hash,
      salt,
      address: process.env.ADMIN_UI_ADDRESS,
      phone: process.env.ADMIN_UI_TELEPHONE,
      roleId: 1,
      membershipId: 1
    }, options);
  }

  async createUser({ firstname, lastname, username, email, hash, salt, address, phone }) {
    return this.User.create({
      firstname,
      lastname,
      username,
      email,
      password_hash: hash,
      salt: salt,
      address,
      phone,
      roleId: 2,
      membershipId: 1
    });
  }

  async getAuthByName(username) {
    return this.User.findOne({
      where: { username },
      attributes: ['id', 'username', 'email', 'password_hash', 'salt', 'roleId']
    });
  }

  async getAll() {
    return this.User.findAll({
      attributes: {
        exclude: ['password_hash', 'salt']
      },
      include: [
        {
          model: this.Role,
          attributes: ['id', 'role']
        },
        {
          model: this.Membership,
          attributes: ['id', 'status', 'min_quantity', 'max_quantity', 'discount']
        }
      ]
    });
  }

  async getOne(userId) {
    return await this.User.findOne({
      where: { id: userId },
      attributes: {
        exclude: ['password_hash', 'salt']
      },
      include: [
        {
          model: this.Role,
          attributes: ['id', 'role']
        },
        {
          model: this.Membership,
          attributes: ['id', 'status', 'min_quantity', 'max_quantity', 'discount']
        }
      ]
    });
  }

  async changeUserRole(userId, newRoleId) {
    await this.User.update({ roleId: newRoleId }, {
      where: { id: userId }
    });
    return this.User.findOne({
      where: { id: userId },
      attributes: { exclude: ["password_hash", "salt"] },
      include: [
        { model: this.Role, attributes: ["id", "role"] },
        {
          model: this.Membership,
          attributes: ["id", "status", "min_quantity", "max_quantity", "discount"]
        }
      ]
    });
  }

  async updateMembership(userId, options = {}) {
    const user = await this.User.findByPk(userId, {
      attributes: ["id", "total_items_purchased", "membershipId"],
      transaction: options.transaction,
    });
    if (!user) {
      throw new Error("User not found");
    }
    const total = user.total_items_purchased;

    const membership = await this.Membership.findOne({
      where: {
        min_quantity: { [Op.lte]: total },
        [Op.or]: [
          { max_quantity: { [Op.gte]: total } },
          { max_quantity: 0 }
        ]
      },
      transaction: options.transaction
    });

    if (membership && membership.id !== user.membershipId) {
      await user.update(
        { membershipId: membership.id },
        { transaction: options.transaction }
      );
    }
    return membership;
  }
}

module.exports = UserService;