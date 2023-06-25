import { Router } from "express";
import { authService } from "../services/authService.js";
import { responseMiddleware } from "../middlewares/response.middleware.js";

const router = Router();

router.post(
  "/login",
  (req, res, next) => {
    try {
      // TODO: Implement login action (get the user if it exist with entered credentials)
      const data = req.body;
      res.send(authService.login(data));
    } catch (err) {
      res.err = err;
      res.status(404).send({ error: true, message: err.message });
    } finally {
      next();
    }
  },
  responseMiddleware
);

export { router };
