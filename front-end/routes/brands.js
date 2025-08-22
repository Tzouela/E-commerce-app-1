var express = require('express');
var axios = require('axios');
var router = express.Router();
var { checkIfAuthorized } = require('./authMiddlewares');

router.get('/', checkIfAuthorized, async function (req, res, next) {
  try {
    const token = req.session.jwt;
    const brandsResponse = await axios.get('http://localhost:3000/brands/admin', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const brands = brandsResponse.data.data;

    return res.render('brands', {
      brands: brands
    });
  } catch (err) {
    if (err.response && err.response.status === 401) {
      delete req.session.jwt;
      return res.redirect("/admin/login");
    }
    console.error('Error fetching brands:', err);
    res.status(500).send('Internal Server Error');
  }
});

router.get('/:id', checkIfAuthorized, async function (req, res, next) {
  try {
    const token = req.session.jwt;
    const brandId = req.params.id;

    const response = await axios.get(
      `http://localhost:3000/brands/admin/${brandId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
    const brand = response.data.data;
    if (!brand) {
      return res.status(404).send('Brand not found');
    }
    return res.render('brandDetail', { brand: brand });
  } catch (err) {
    if (err.response && err.response.status === 401) {
      delete req.session.jwt;
      return res.redirect("/admin/login");
    }
    if (err.response && err.response.status === 404) {
      return res.status(404).send("Brand not found");
    }
    console.error('Error fetching brand:', err);
    res.status(500).send('Internal Server Error');
  }
});

router.post('/', checkIfAuthorized, async function (req, res, next) {
  try {
    const token = req.session.jwt;
    await axios.post("http://localhost:3000/brands/admin", req.body,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      }
    );
    return res.redirect("/brands");
  } catch (err) {
    if (err.response && err.response.status === 401) {
      delete req.session.jwt;
      return res.redirect("/admin/login");
    }
    console.error("Error creating brand:", err);
    return res.status(500).send("Failed to create brand");
  }
});

router.put('/:id', checkIfAuthorized, async function (req, res) {
  try {
    const token = req.session.jwt;
    const brandId = req.params.id;
    const updatedData = { name: req.body.name };

    await axios.put(
      `http://localhost:3000/brands/admin/${brandId}`,
      updatedData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
    return res.redirect("/brands");
  } catch (err) {
    if (err.response && err.response.status === 401) {
      delete req.session.jwt;
      return res.redirect("/admin/login");
    }
    console.error("Error updating brand:", err);
    return res.status(500).send("Failed to update brand");
  }
});

router.delete('/:id', checkIfAuthorized, async function (req, res) {
  try {
    const token = req.session.jwt;
    const brandId = req.params.id;

    await axios.delete(
      `http://localhost:3000/brands/admin/${brandId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    return res.redirect("/brands");
  } catch (err) {
    if (err.response && err.response.status === 401) {
      delete req.session.jwt;
      return res.status(401).json({ message: "Session expired" });
    }
    console.error("Error deleting brand:", err);
    return res.status(500).json({ error: "Failed to delete brand" });
  }
});

module.exports = router;