import * as jwt from "jsonwebtoken";
import * as util from "../../utils/util.js";
const authMiddleware = (req, res, next) => {
  const bearerToken = req.get("Authorization");
  if (!bearerToken) {
    return res.status(401).json({
      message: "Not Authorized",
    });
  }
  const token = bearerToken.split(" ")[1];

  let decodeToken;
  try {
    const privateKey = Buffer.from(process.env.JWT_KEY).toString("base64");
    decodeToken = jwt.default.verify(token, privateKey);
  } catch (err) {
    util.setDbError(err);
    throw err;
  }
  if (!decodeToken) {
    return res.status(401).json({
      message: "Not Authorized",
    });
  }
  req.userId = decodeToken.userId;
  next();
};
export default authMiddleware;
