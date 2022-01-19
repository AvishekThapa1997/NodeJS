import express from "express";
import passport from "passport";
import * as controllers from "../controllers/controllers.js";
import * as authMiddleware from "../middleware/authMiddleware.js";
const router = new express.Router();
router.get("/", (req, res, next) => {
  res.send('<h1>Home</h1><p>Please <a href="/register">register</a></p>');
});
router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login-failure",
    successRedirect: "/login-success",
  })
);

router.post("/register", controllers.registerUser);

// When you visit http://localhost:3000/login, you will see "Login Page"
router.get("/login", (req, res, next) => {
  const form =
    '<h1>Login Page</h1><form method="POST" action="/login">\
    Enter Username:<br><input type="text" name="username">\
    <br>Enter Password:<br><input type="password" name="password">\
    <br><br><input type="submit" value="Submit"></form>';

  res.send(form);
});

// When you visit http://localhost:3000/register, you will see "Register Page"
router.get("/register", (req, res, next) => {
  const form = `<h1>Register Page</h1><form method="post" action="register">\
                    Enter Username:<br><input type="text" name="username">\
                    <br>Enter Password:<br><input type="password" name="password">\
                    <br><br><select name="user-type"><option value="1">Admin</option>
                    <option value="0" selected>User</option>
                    </select > <input type="submit" value="Submit"></form>`;

  res.send(form);
});

/**
 * Lookup how to authenticate users on routes with Local Strategy
 * Google Search: "How to use Express Passport Local Strategy"
 *
 * Also, look up what behaviour express session has without a maxage set
 */
router.get(
  "/protected-route",
  authMiddleware.isAuthenticated,
  (req, res, next) => {
    res.send("<h1>You made it to route</h1>");
  }
);
router.get(
  "/admin-route",
  authMiddleware.isAuthenticated,
  authMiddleware.isAdmin,
  (req, res, next) => {
    res.send("<h1>You made it to Admin route</h1>");
  }
);

// Visiting this route logs the user out
router.get("/logout", (req, res, next) => {
  req.logout();
  res.redirect("/protected-route");
});

router.get("/login-success", (req, res, next) => {
  res.send(
    '<p>You successfully logged in. --> <a href="/protected-route">Go to protected route</a></p>'
  );
});

router.get("/login-failure", (req, res, next) => {
  res.send("You entered the wrong password.");
});
export default router;
