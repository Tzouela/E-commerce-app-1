module.exports = {
  checkIfAuthorized(req, res, next) {
    if (!req.session.jwt) {
      return res.redirect("/admin/login");
  }
  next();
}
}