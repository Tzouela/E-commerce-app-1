var { Op, where } = require('sequelize');

class MembershipService {
  constructor(db) {
    this.client = db.sequelize;
    this.Membership = db.Membership;
  }
  async createMemberships(options = {}) {
    return await this.Membership.bulkCreate([
      { id: 1, status: 'Bronze', min_quantity: 0, max_quantity: 15, discount: 0.00 },
      { id: 2, status: 'Silver', min_quantity: 16, max_quantity: 30, discount: 0.15 },
      { id: 3, status: 'Gold', min_quantity: 31, max_quantity: 0, discount: 0.30 }
    ], options);
  }

  async getAllMemberships() {
    return await this.Membership.findAll({
      where: {}
    });
  }

  async getMembershipById(id) {
    return this.Membership.findByPk(id);
  }
}

module.exports = MembershipService;