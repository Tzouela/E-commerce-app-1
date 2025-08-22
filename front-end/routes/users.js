var express = require('express');
var axios = require('axios');
var router = express.Router();
var { checkIfAuthorized } = require('./authMiddlewares');

router.get('/', checkIfAuthorized, async function (req, res, next) {
  try {
    const token = req.session.jwt;
    const [usersResponse, rolesResponse] = await Promise.all([
      axios.get('http://localhost:3000/users/admin', {
        headers: { Authorization: `Bearer ${token}` }
      }),
      axios.get('http://localhost:3000/roles/admin', {
        headers: { Authorization: `Bearer ${token}` }
      })
    ]);

    const users = usersResponse.data.users;
    const roles = rolesResponse.data.data; 

    return res.render('users', {
      users,
      roles
    });
  } catch (err) { 
    if (err.response && err.response.status === 401) {
      delete req.session.jwt;
      return res.redirect("/admin/login");
    }
    console.error('Error fetching users or roles:', err);
    res.status(500).send('Internal Server Error');
  }
});

router.patch('/:id', checkIfAuthorized, async function (req, res) {
  try {
    const token = req.session.jwt;
    const userId = req.params.id;
     const { roleId } = req.body;

    await axios.patch(
      `http://localhost:3000/users/admin/${userId}/role`,
      { roleId: Number(roleId) },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
    return res.redirect("/users");
  } catch (err) {
    if (err.response && err.response.status === 401) {
      delete req.session.jwt;
      return res.redirect("/admin/login");
    }
    console.error("Error updating user role:", err);
    return res.status(500).send("Failed to update user role");
  }
});

module.exports = router;
