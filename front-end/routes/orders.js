var express = require('express');
var axios = require('axios');
var router = express.Router();
var { checkIfAuthorized } = require('./authMiddlewares');

router.get('/', checkIfAuthorized, async function (req, res, next) {
  try {
    const token = req.session.jwt;
    const response = await axios.get('http://localhost:3000/orders/admin', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const orders = response.data.orders;

    return res.render('orders', {
      orders: orders
    });
  } catch (err) {
    if (err.response && err.response.status === 401) {
      delete req.session.jwt;
      return res.redirect("/admin/login");
    }
    console.error('Error fetching orders:', err);
    res.status(500).send('Internal Server Error');
  }
});

router.put('/:orderId/status', checkIfAuthorized, async (req, res) => {
  try {
    const token = req.session.jwt;
    const orderId = parseInt(req.params.orderId, 10);
    const { newStatus } = req.body;

    const validStatuses = [ 'In progress', 'Ordered', 'Completed' ];
    if (!validStatuses.includes(newStatus)) {
      return res.status(400).send('Invalid status');
    }

    await axios.put(
      `http://localhost:3000/orders/admin/${orderId}/status`,
      { newStatus },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return res.redirect('/orders');
  } catch (err) {
    if (err.response && err.response.status === 401) {
      delete req.session.jwt;
      return res.redirect('/admin/login');
    }
    console.error('Error updating order status:', err.response?.data || err.message || err);
    return res.status(500).send('Failed to update order status');
  }
});

module.exports = router;