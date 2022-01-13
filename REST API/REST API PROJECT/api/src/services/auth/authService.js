import User from "../../model/User.js";
export const signUpUser = (newUser) => {
  return User.save(newUser);
};
export const checkIfEmailExists = (email) => {
  return User.getUserByEmail(email);
};

export const getUserById = (id) => {
  return User.getUserById(id);
};
