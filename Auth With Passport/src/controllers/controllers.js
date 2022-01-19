import User from "../models/User.js";
import * as passwordUtils from "../utils/passwordUtil.js";
export const registerUser = async (req, res, next) => {
  const { username, password, "user-type": userType } = req.body;

  try {
    const hashedPassword = await passwordUtils.genPassword(password);
    await User.save({
      username,
      password: hashedPassword,
      admin: userType,
    });
    res.redirect("/login");
  } catch (err) {
    next(err);
  }
};
