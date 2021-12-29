const User = require("../models/user");
exports.getLogin = (req, res, next) => {
  //   const isLoggedIn = req.get("Cookie")?.trim().split("=").at(1); // Extracting Cookie
  const isLoggedIn = req.session.isLoggedIn; // Extracting Session
  //   console.log(isLoggedIn);
  //   console.log(isLoggedIn);
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    isLoggedIn: req.session.user,
  });
};

exports.postLogin = (req, res, next) => {
  User.findUserById()
    .then((user) => {
      req.session.isLoggedIn = true;
      req.session.user = user;
      req.session.save((err) => {
        //  Since session are stored in database so it might take some
        // time to complete but redirect is done independent of the session
        // insertion in the database.So req.session.save() receives a callback which exectues
        // when database operation related to session is completed
        res.redirect("/");
      });
    })
    .catch((err) => {
      console.log(err);
    });
  //   res.setHeader("Set-Cookie", "isLoggedIn=true"); // Setting Cookie
};
exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (!err) {
      res.redirect("/");
    }
  });
};
