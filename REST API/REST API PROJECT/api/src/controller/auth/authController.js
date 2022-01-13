import bcrypt from "bcryptjs";
// import * as jose from "jose";
import * as authService from "../../services/auth/authService.js";
import * as util from "../../utils/util.js";
import * as jwt from "jsonwebtoken";
export const signUpUser = (req, res, next) => {
  const { email, password, name } = req.body;
  bcrypt
    .hash(password, 12)
    .then((hashedPassword) => {
      return authService.signUpUser({
        email,
        password: hashedPassword,
        name,
      });
    })
    .then((userCreated) => {
      res.status(201).send({
        message: "Successfully Registered",
        userId: userCreated._id,
      });
    })
    .catch((err) => {
      util.setDbError(err);
      next(err);
    });
};
export const loginUser = (req, res, next) => {
  const { email, password } = req.body;
  let _user;
  checkIfEmailExists(email)
    .then((user) => {
      if (!user) {
        util.throwError(404, "User not found.");
      }
      _user = user;
      return bcrypt.compare(password, user.password);
    })
    .then((passwordMatched) => {
      if (!passwordMatched) {
        util.throwError(401, "Wrong Password.");
      }
      const privateKey = Buffer.from(process.env.JWT_KEY).toString("base64");
      return generateJWT_Token(privateKey, process.env.KEY_ALGORITHM, _user);
    })
    .then((token) => {
      res.status(200).send({
        token,
        userId: _user._id,
      });
    })
    .catch((err) => {
      util.setDbError(err);
      next(err);
    });
};
export const checkIfEmailExists = (email) => {
  return authService.checkIfEmailExists(email);
};

const generateJWT_Token = (privateKey, algorithm, user) => {
  // console.log(privateKey);
  // return new jose.SignJWT({
  //   email: user.email,
  //   userId: user._id,
  // })
  //   .setIssuedAt(Date.now())
  //   .setProtectedHeader({
  //     alg: "ES256",
  //     typ: "JWT",
  //   })
  //   .setExpirationTime("1h")
  //   .sign(privateKey);
  return jwt.default.sign(
    {
      email: user.email,
      userId: user._id,
    },
    privateKey,
    {
      expiresIn: "1h",
    }
  );
};
