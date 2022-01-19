import passport from "passport";
import passportLocal from "passport-local";
import * as passwordUtils from "../../utils/passwordUtil.js";
import User from "../../models/User.js";
const LocalStrategy = passportLocal.Strategy;
const verifyCallback = async (username, password, cb) => {
  try {
    const user = await User.findUserByUsername(username);
    if (!user) {
      return cb(false, null);
    }
    const isValidPassword = await passwordUtils.validPassword(
      password,
      user.password
    );
    if (!isValidPassword) {
      return cb(false, null);
    }
    cb(false, user);
  } catch (err) {
    return cb(err, null);
  }
};
const strategy = new LocalStrategy(verifyCallback);
passport.serializeUser((user, done) => {
  if (!user) {
    return done(new Error("User not found!"), null);
  }
  done(null, user.id);
});
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findUserById(id);
    if (!user) {
      return done(new Error("User not found!"), null);
    }
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});
export default passport.use(strategy);
