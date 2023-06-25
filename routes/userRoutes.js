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

export { router };
