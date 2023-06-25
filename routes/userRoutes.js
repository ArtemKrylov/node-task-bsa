import { Router } from "express";
import { userService } from "../services/userService.js";
import {
  createUserValid,
  updateUserValid,
} from "../middlewares/user.validation.middleware.js";
import { responseMiddleware } from "../middlewares/response.middleware.js";

const router = Router();

// TODO: Implement route controllers for user
router.post(
  "",
  (req, res, next) => {
    try {
      const user = req.body;
      if (userService.doesUserExist(user)) {
        updateUserValid(req, res, next);
      } else {
        createUserValid(req, res, next);
      }
    } catch (error) {
      res.err = error;
    } finally {
      next();
    }
  },
  responseMiddleware
);

router.get("", (_, res, next) => {
  try {
    res.send(userService.getAllUsers());
  } catch (error) {
    res.status(400).send(error.message);
  } finally {
    next();
  }
});

router.get("/:id", (req, res, next) => {
  try {
    const id = req.params.id;
    if (userService.doesUserExistById(id)) {
      res.send(userService.getUserById(id));
    } else {
      throw new Error("User with this id does not exist!");
    }
  } catch (error) {
    res.status(404).send(error.message);
  } finally {
    next();
  }
});

router.put("/:id", (req, res, next) => {
  try {
    const id = req.params.id;
    const user = req.body;
    if (userService.doesUserExistById(id)) {
      res.send(userService.updateUserById(id, user));
    } else {
      throw new Error("User with this id does not exist!");
    }
  } catch (error) {
    res.status(404).send(error.message);
  } finally {
    next();
  }
});

router.delete("/:id", (req, res, next) => {
  try {
    const id = req.params.id;
    if (userService.doesUserExistById(id)) {
      res.send(userService.deleteUser(id));
    } else {
      throw new Error("User with this id does not exist!");
    }
  } catch (error) {
    res.status(404).send(error.message);
  } finally {
    next();
  }
});

export { router };
