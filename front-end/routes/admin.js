var express = require('express');
var axios = require("axios");
var router = express.Router();

router.get('/login', function (req, res, next) {
  if (req.session.jwt) {
    return res.redirect("/");
  }
  res.render("admin", { error: null });
});

router.post('/login', async function (req, res, next) {
  const { username, password } = req.body;
  try {
    const response = await axios.post("http://localhost:3000/admin/login",
      { username, password },
      { headers: { "Content-Type": "application/json" } }
    );
    const token = response.data.token;
    if (!token) {
      throw new Error("Login did not return a token");
    }
    req.session.jwt = token;
    req.session.save((err) => {
      if (err) {
        console.error("Session save error:", err);
        return res.render("admin", { error: "Unable to save session. Try again." });
      }
      return res.redirect("/");
    });
  } catch (err) {
    let message = "Login failed. Please try again.";
    if (
      err.response &&
      err.response.data &&
      typeof err.response.data.message === "string"
    ) {
      message = err.response.data.message;
    }
    return res.render("admin", { error: message });
  }
});

module.exports = router;