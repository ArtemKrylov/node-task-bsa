import { USER } from "../models/user.js";
import { userService } from "../services/userService.js";

function haveSameKeys(user, model) {
  const userKeys = Object.keys(user);
  const modelKeys = Object.keys(model);
  modelKeys.splice(modelKeys.indexOf("id"), 1);
  if (userKeys.length !== modelKeys.length) return false;
  userKeys.forEach((key) => {
    if (!modelKeys.hasOwnProperty(key)) {
      return false;
    }
  });
  return true;
}

function checkUser(user, model) {
  if (
    haveSameKeys(user, model) &&
    typeof user.password === "string" &&
    user.password.length >= 3 &&
    user.email.endsWith("@gmail.com") &&
    user.phoneNumber.startsWith("+380") &&
    user.phoneNumber.length === 13
  ) {
    return true;
  }
  return false;
}

const createUserValid = (req, res, next) => {
  // TODO: Implement validatior for USER entity during creation
  const userData = req.body;
  if (checkUser(userData, USER)) {
    res.send(userService.createUser(userData));
  } else {
    res.status(400).send({
      error: true,
      message:
        "User is not valid: phoneNumber: +380xxxxxxxxx, email - only gmail, password min 3 symbols",
    });
  }

  next();
};

const updateUserValid = (req, res, next) => {
  // TODO: Implement validatior for user entity during update
  const userData = req.body;
  if (checkUser(userData, USER)) {
    res.send(userService.updateUser(userData));
  } else {
    res.status(400).send({
      error: true,
      message:
        "User is not valid: phoneNumber: +380xxxxxxxxx, email - only gmail, password min 3 symbols",
    });
  }
  next();
};

export { createUserValid, updateUserValid };
