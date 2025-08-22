var { Op } = require('sequelize');

class RoleService {
  constructor(db) {
    this.client = db.sequelize;
    this.Role = db.Role;
  }

  async createRoles(options = {}) {
    return await this.Role.bulkCreate([
      { id: 1, role: 'Admin' },
      { id: 2, role: 'User' }
    ], options);
  }

  async getAllRoles() {
    return await this.Role.findAll({
      where: {}
    });
  }

  async getRoleById(id) {
    return this.Role.findByPk(id);
  }
}

module.exports = RoleService;