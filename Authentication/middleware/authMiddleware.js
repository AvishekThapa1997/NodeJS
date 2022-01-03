module.exports = (req, res, next) => {
  console.log("Middleware");
  if (!req.session.userId) {
    return res.redirect("/login");
  }
  next();
};
