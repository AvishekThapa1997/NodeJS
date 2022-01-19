export const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).send({
    message: "Not Authorized",
  });
};

export const isAdmin = (req, res, next) => {
  if (req.user.admin) {
    return next();
  }
  res.status(401).send({
    message: "You are not an admin",
  });
};
