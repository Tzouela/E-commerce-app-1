require('dotenv').config()
var { Op } = require('sequelize');
var axios = require('axios');

var PRODUCT_API_URL = process.env.PRODUCT_API_URL || 'http://backend.restapi.co.za/items/products';


class InitService {
  constructor(db, services) {
    this.client = db.sequelize;
    this.RoleService = services.role;
    this.MembershipService = services.membership;
    this.UserService = services.user;
    this.ProductService = services.product;
  }

  async initializeDatabase() {
    return this.client.transaction(async (t) => {
      await this.RoleService.createRoles({ transaction: t });
      await this.MembershipService.createMemberships({ transaction: t });
      await this.UserService.createInitialAdmin({ transaction: t });
      const response = await axios.get(PRODUCT_API_URL);
      const rawProducts = response.data.data;
      await this.ProductService.bulkImportAPI(rawProducts, { transaction: t });
    })
  }
}

module.exports = InitService;
