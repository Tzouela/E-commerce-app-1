var { QueryTypes, where } = require('sequelize');

class ProductService {
  constructor(db) {
    this.client = db.sequelize;
    this.Product = db.Product;
    this.Category = db.Category;
    this.Brand = db.Brand;
  }

  async bulkImportAPI(rawProducts, options = {}) {
    const { transaction } = options;

    const brands = Array.from(new Set(
      rawProducts.map(p => p.brand).filter(Boolean)
    ));
    const categories = Array.from(new Set(
      rawProducts.map(p => p.category).filter(Boolean)
    ));

    if (brands.length) {
      await this.Brand.bulkCreate(
        brands.map(name => ({ name })),
        { transaction, ignoreDuplicates: true }
      );
    }

    if (categories.length) {
      await this.Category.bulkCreate(
        categories.map(name => ({ name })),
        { transaction, ignoreDuplicates: true }
      );
    }

    const dbBrands = await this.Brand.findAll({
      where: { name: brands },
      transaction,
      attributes: ['id', 'name']
    });
    const brandMap = dbBrands.reduce((acc, brand) => {
      acc[brand.name] = brand.id;
      return acc;
    }, {});

    const dbCategories = await this.Category.findAll({
      where: { name: categories },
      transaction,
      attributes: ['id', 'name']
    });
    const categoryMap = dbCategories.reduce((acc, category) => {
      acc[category.name] = category.id;
      return acc;
    }, {});

    const rows = rawProducts.map(p => ({
      id: p.id,
      image_url: p.imgurl,
      name: p.name,
      description: p.description,
      price: p.price,
      stock_quantity: p.quantity,
      brandId: brandMap[p.brand],
      categoryId: categoryMap[p.category],
    }));
    return this.Product.bulkCreate(rows, { transaction });
  }

  async getAllProducts() {
    const sql = `
    SELECT 
      p.id, 
      p.image_url, 
      p.name, 
      p.description, 
      p.price, 
      p.stock_quantity,
      b.name AS brand_name, 
      c.name AS category_name
    FROM Products p
    LEFT JOIN Brands AS b ON p.brandId = b.id
    LEFT JOIN Categories AS c ON p.categoryId = c.id
    WHERE p.deleted_at IS NULL
    ORDER BY p.id
  `;
    return this.client.query(sql, { type: QueryTypes.SELECT });
  }

  async getAllProductsAdmin() {
    const sql = `
    SELECT 
      p.id, 
      p.image_url, 
      p.name, 
      p.description, 
      p.price, 
      p.stock_quantity,
      b.name AS brand_name, 
      c.name AS category_name,
      p.deleted_at
    FROM Products p
    LEFT JOIN Brands AS b ON p.brandId = b.id
    LEFT JOIN Categories AS c ON p.categoryId = c.id
    ORDER BY p.id
  `;
    return this.client.query(sql, { type: QueryTypes.SELECT });
  }

  async getProductById(id) {
    const sql = `
      SELECT 
        p.id, 
        p.image_url, 
        p.name, 
        p.description, 
        p.price, 
        p.stock_quantity,
        b.name AS brand_name, 
        c.name AS category_name
      FROM Products p
      LEFT JOIN Brands b ON p.brandId = b.id
      LEFT JOIN Categories c ON p.categoryId = c.id
      WHERE p.id = :id
        AND p.deleted_at IS NULL
      LIMIT 1
    `;
    return this.client.query(sql, {
      type: QueryTypes.SELECT,
      replacements: { id }
    });
  }

  async getProductByIdAdmin(id) {
    const sql = `
      SELECT 
        p.id, 
        p.image_url, 
        p.name, 
        p.description, 
        p.price, 
        p.stock_quantity,
        b.name AS brand_name, 
        c.name AS category_name,
        p.deleted_at
      FROM Products p
      LEFT JOIN Brands b ON p.brandId = b.id
      LEFT JOIN Categories c ON p.categoryId = c.id
      WHERE p.id = :id
      LIMIT 1
    `;
    return this.client.query(sql, {
      type: QueryTypes.SELECT,
      replacements: { id }
    });
  }

  async createProduct(productData) {
    const [brand] = await this.Brand.findOrCreate({
      where: { name: productData.brandName },
      defaults: { name: productData.brandName }
    });

    const [category] = await this.Category.findOrCreate({
      where: { name: productData.categoryName },
      defaults: { name: productData.categoryName }
    });

    const product = await this.Product.create({
      image_url: productData.imgurl,
      name: productData.name,
      description: productData.description,
      price: productData.price,
      stock_quantity: productData.quantity,
      brandId: brand.id,
      categoryId: category.id
    });

    const [created] = await this.client.query(
      `
      SELECT
      p.id,
      p.image_url,
      p.name,
      p.description,
      p.price,
      p.stock_quantity,
      b.name AS brand_name,
      c.name AS category_name
      FROM Products p
      LEFT JOIN Brands AS b ON p.brandId = b.id
      LEFT JOIN Categories AS c ON p.categoryId = c.id
      WHERE p.id = :id
      LIMIT 1
      `,
      {
        replacements: { id: product.id },
        type: QueryTypes.SELECT
      }
    );
    return created;
  }

  async updateProduct(id, productData) {
    const [brand] = await this.Brand.findOrCreate({
      where: { name: productData.brandName },
      defaults: { name: productData.brandName }
    });

    const [category] = await this.Category.findOrCreate({
      where: { name: productData.categoryName },
      defaults: { name: productData.categoryName }
    });

    await this.Product.update({
      image_url: productData.imgurl,
      name: productData.name,
      description: productData.description,
      price: productData.price,
      stock_quantity: productData.quantity,
      brandId: brand.id,
      categoryId: category.id
    }, {
      where: { id }
    });
    
    const [updated] = await this.client.query(
      `
      SELECT
      p.id,
      p.image_url,
      p.name,
      p.description,
      p.price,
      p.stock_quantity,
      b.name AS brand_name,
      c.name AS category_name
      FROM Products p
      LEFT JOIN Brands AS b ON p.brandId = b.id
      LEFT JOIN Categories AS c ON p.categoryId = c.id
      WHERE p.id = :id
      LIMIT 1
      `,
      {
        replacements: { id },
        type: QueryTypes.SELECT
      }
    );
    return updated;
  }

  async softDeleteProduct(id) {
    return this.Product.destroy({
      where: { id }
    });
  }

  async restoreProduct(id) {
    return this.Product.restore({
      where: { id }
    });
  }
}

module.exports = ProductService;