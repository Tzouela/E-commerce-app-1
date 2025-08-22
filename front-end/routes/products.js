var express = require('express');
var axios = require('axios');
var router = express.Router();
var { checkIfAuthorized } = require('./authMiddlewares');

router.get('/', checkIfAuthorized, async function (req, res, next) {
  try {
    const token = req.session.jwt;
    const productsResponse = await axios.get('http://localhost:3000/products/admin', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const products = productsResponse.data.data;

    const [categoryResponse, brandsResponse] = await Promise.all([
      axios.get("http://localhost:3000/categories"),
      axios.get("http://localhost:3000/brands")
    ]);
    const categories = categoryResponse.data.data;
    const brands = brandsResponse.data.data;

    return res.render('products', {
      products: products,
      categories: categories,
      brands: brands,
      name: "",
      category: "",
      brand: ""
    });
  } catch (err) {
    if (err.response && err.response.status === 401) {
      delete req.session.jwt;
      return res.redirect("/admin/login");
    }
    console.error('Error fetching data:', err);
    res.status(500).send('Internal Server Error');
  }
});

router.post('/search', checkIfAuthorized, async function (req, res, next) {
  try {
    const token = req.session.jwt;
    const { name, category, brand } = req.body;
    const searchResp = await axios.post("http://localhost:3000/search", {
      name,
      category,
      brand
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });

    const filteredProducts = searchResp.data.products;

    const [categoriesResp, brandsResp] = await Promise.all([
      axios.get("http://localhost:3000/categories"),
      axios.get("http://localhost:3000/brands")
    ]);

    const categories = categoriesResp.data.data;
    const brands = brandsResp.data.data;

    return res.render("products", {
      products: filteredProducts,
      categories: categories,
      brands: brands,
      name: name || "",
      category: category || "",
      brand: brand || ""
    });
  } catch (err) {
    if (err.response && err.response.status === 401) {
      delete req.session.jwt;
      return res.redirect("/admin/login");
    }
    console.error("Error searching products:", err);
    return res.status(500).send("Failed to search products");
  }

});

router.post('/create', checkIfAuthorized, async function (req, res, next) {
  try {
    const token = req.session.jwt;
    await axios.post("http://localhost:3000/products/admin", req.body,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      }
    );
    return res.redirect("/products");
  } catch (err) {
    if (err.response && err.response.status === 401) {
      delete req.session.jwt;
      return res.redirect("/admin/login");
    }
    console.error("Error creating product:", err);
    return res.status(500).send("Failed to create product");
  }
});

router.put('/:id/restore', checkIfAuthorized, async function (req, res) {
  const productId = req.params.id;
  try {
    const token = req.session.jwt;
    await axios.put(`http://localhost:3000/products/admin/${productId}/restore`, {},
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    return res.redirect("/products");
  } catch (err) {
    if (err.response && err.response.status === 401) {
      delete req.session.jwt;
      return res.redirect("/admin/login");
    }
    console.error("Error restoring product:", err);
    return res.status(500).send("Failed to restore product");
  }
});

router.get('/:id', checkIfAuthorized, async function (req, res, next) {
  try {
    const token = req.session.jwt;
    const productId = req.params.id;

    const response = await axios.get(
      `http://localhost:3000/products/admin/${productId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
    const product = response.data.data;
    if (!product) {
      return res.status(404).send('Product not found');
    }
    return res.render('productDetail', { product: product });
  } catch (err) {
    if (err.response && err.response.status === 401) {
      delete req.session.jwt;
      return res.redirect("/admin/login");
    }
    if (err.response && err.response.status === 404) {
      return res.status(404).send("Product not found");
    }
    console.error('Error fetching product:', err);
    res.status(500).send('Internal Server Error');
  }
});

router.put('/:id', checkIfAuthorized, async function (req, res) {
  try {
    const token = req.session.jwt;
    const productId = req.params.id;
    const updatedData = {
      imgurl: req.body.imgurl,
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      quantity: req.body.quantity,
      brandName: req.body.brandName,
      categoryName: req.body.categoryName
    };

    await axios.put(
      `http://localhost:3000/products/admin/${productId}`,
      updatedData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
    return res.redirect("/products");
  } catch (err) {
    if (err.response && err.response.status === 401) {
      delete req.session.jwt;
      return res.redirect("/admin/login");
    }
    console.error("Error updating product:", err);
    return res.status(500).send("Failed to update product");
  }
});

router.delete('/:id', checkIfAuthorized, async function (req, res) {
  try {
    const token = req.session.jwt;
    const productId = req.params.id;

    await axios.delete(
      `http://localhost:3000/products/admin/${productId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    return res.redirect("/products");
  } catch (err) {
    if (err.response && err.response.status === 401) {
      delete req.session.jwt;
      return res.status(401).json({ message: "Session expired" });
    }
    console.error("Error deleting product:", err);
    return res.status(500).json({ error: "Failed to delete product" });
  }
});

module.exports = router;