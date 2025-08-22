var express = require('express');
var axios = require('axios');
var router = express.Router();
var { checkIfAuthorized } = require('./authMiddlewares');

router.get('/', checkIfAuthorized, async function (req, res, next) {
  try {
    const token = req.session.jwt;
    const response = await axios.get('http://localhost:3000/memberships/admin', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const memberships = response.data.data;

    return res.render('memberships', {
      memberships: memberships
    });
  } catch (err) {
    if (err.response && err.response.status === 401) {
      delete req.session.jwt;
      return res.redirect("/admin/login");
    }
    console.error('Error fetching memberships:', err);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;