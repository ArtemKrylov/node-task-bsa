import { Router } from "express";
import { fightersService } from "../services/fightService.js";
import {
  createUserValid,
  updateUserValid,
} from "../middlewares/user.validation.middleware.js";
import { responseMiddleware } from "../middlewares/response.middleware.js";

const router = Router();

// OPTIONAL TODO: Implement route controller for fights

router.post(
  "",
  (req, res, next) => {
    try {
      const data = req.body;
      const fight = fightersService.createFight(data);
      res.send(fight);
    } catch (error) {
      res.status(400).send({
        error: true,
        message: "Fight request is not valid",
      });
    } finally {
      next();
    }
  },
  responseMiddleware
);

router.post(
  "/:id",
  (req, res, next) => {
    try {
      const id = req.params.id;
      const winner = req.body;
      const result = fightersService.finishFight(id, winner);
      res.send(result);
    } catch (error) {
      res.status(400).send({
        error: true,
        message: error.message,
      });
    } finally {
      next();
    }
  },
  responseMiddleware
);

export { router };
