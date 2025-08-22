var express = require('express');
var axios = require('axios');
var router = express.Router();
var { checkIfAuthorized } = require('./authMiddlewares');

router.get('/', checkIfAuthorized, async function (req, res, next) {
  try {
    const token = req.session.jwt;
    const categoriesResponse = await axios.get('http://localhost:3000/categories/admin', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const categories = categoriesResponse.data.data;

    return res.render('categories', {
      categories: categories
    });
  } catch (err) { 
    if (err.response && err.response.status === 401) {
      delete req.session.jwt;
      return res.redirect("/admin/login");
    }
    console.error('Error fetching categories:', err);
    res.status(500).send('Internal Server Error');
  }
});

router.get('/:id', checkIfAuthorized, async function (req, res, next) {
  try {
    const token = req.session.jwt;
    const categoryId = req.params.id;

    const response = await axios.get(
      `http://localhost:3000/categories/admin/${categoryId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
    const category = response.data.data;
    if (!category) {
      return res.status(404).send('Category not found');
    }
    return res.render('categoryDetail', { category: category });
  } catch (err) {
    if (err.response && err.response.status === 401) {
      delete req.session.jwt;
      return res.redirect("/admin/login");
    }
    if (err.response && err.response.status === 404) {
      return res.status(404).send("Category not found");
    }
    console.error('Error fetching category:', err);
    res.status(500).send('Internal Server Error');
  }
});

router.post('/', checkIfAuthorized, async function (req, res, next) {
  try {
    const token = req.session.jwt;
    await axios.post("http://localhost:3000/categories/admin", req.body,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      }
    );
    return res.redirect("/categories");
  } catch (err) {
    if (err.response && err.response.status === 401) {
      delete req.session.jwt;
      return res.redirect("/admin/login");
    }
    console.error("Error creating category:", err);
    return res.status(500).send("Failed to create category");
  }
});

router.put('/:id', checkIfAuthorized, async function (req, res) {
  try {
    const token = req.session.jwt;
    const categoryId = req.params.id;
    const updatedData = { name: req.body.name };

    await axios.put(
      `http://localhost:3000/categories/admin/${categoryId}`,
      updatedData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
    return res.redirect("/categories");
  } catch (err) {
    if (err.response && err.response.status === 401) {
      delete req.session.jwt;
      return res.redirect("/admin/login");
    }
    console.error("Error updating category:", err);
    return res.status(500).send("Failed to update category");
  }
});

router.delete('/:id', checkIfAuthorized, async function (req, res) {
  try {
    const token = req.session.jwt;
    const categoryId = req.params.id;

    await axios.delete(
      `http://localhost:3000/categories/admin/${categoryId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    return res.redirect("/categories");
  } catch (err) {
    if (err.response && err.response.status === 401) {
      delete req.session.jwt;
      return res.status(401).json({ message: "Session expired" });
    }
    console.error("Error deleting category:", err);
    return res.status(500).json({ error: "Failed to delete category" });
  }
});

module.exports = router;