import dotenv from "dotenv";
dotenv.config();
import bcryptjs from "bcryptjs";
export const validPassword = (password, hashedPassword) => {
  return bcryptjs.compare(password, hashedPassword);
};
export const genPassword = (password) => {
  return bcryptjs.hash(password, +process.env.PASSWORD_HASH);
};
