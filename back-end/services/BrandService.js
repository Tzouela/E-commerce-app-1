var { Op } = require('sequelize');

class BrandService {
  constructor(db) {
    this.client = db.sequelize;
    this.Brand = db.Brand;
  }

  async getAllBrands() {
    return this.Brand.findAll();
  }

  async getAllBrandsForAdmin() {
    return this.Brand.findAll();
  }

  async getBrandById(id) {
    return this.Brand.findByPk(id);
  }

  async getBrandByIdForAdmin(id) {
    return this.Brand.findByPk(id);
  }

  async createBrand(brandData) {
    return this.Brand.create(brandData);
  }

  async updateBrand(id, brandData) {
    await this.Brand.update(brandData, { where: { id } });
    return await this.Brand.findByPk(id);
  }

  async deleteBrand(id) {
    return this.Brand.destroy({
      where: { id }
    });
  }

}

module.exports = BrandService;