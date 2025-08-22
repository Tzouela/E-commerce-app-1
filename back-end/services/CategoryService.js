var { Op } = require('sequelize');

class CategoryService {
  constructor(db) {
    this.client = db.sequelize;
    this.Category = db.Category;
  }

  async getAllCategories() {
    return this.Category.findAll();
  }

  async getAllCategoriesForAdmin() {
    return this.Category.findAll();
  }

  async getCategoryById(id) {
    return this.Category.findByPk(id);
  }

  async getCategoryByIdForAdmin(id) {
    return this.Category.findByPk(id);
  }

  async createCategory(categoryData) {
    return this.Category.create(categoryData);
  }

  async updateCategory(id, categoryData) {
    await this.Category.update(categoryData, { where: { id } });
    return await this.Category.findByPk(id);
  }

  async deleteCategory(id) {
    return this.Category.destroy({
      where: { id }
    });
  }

}

module.exports = CategoryService;