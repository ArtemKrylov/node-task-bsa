import { Router } from "express";
import { fighterService } from "../services/fighterService.js";
import { responseMiddleware } from "../middlewares/response.middleware.js";
import {
  createFighterValid,
  updateFighterValid,
} from "../middlewares/fighter.validation.middleware.js";

const router = Router();

// TODO: Implement route controllers for fighter

router.get(
  "",
  (_, res, next) => {
    try {
      const data = fighterService.getAllFighters();
      console.log("data: ", data);
      res.send(data);
    } catch (error) {
      res.err = error;
    } finally {
      next();
    }
  },
  responseMiddleware
);

router.post(
  "",
  (req, res, next) => {
    try {
      const data = req.body;
      data.health = 100;
      res.send(fighterService.createFighter(data));
    } catch (error) {
      res.err = error;
    } finally {
      next();
    }
  },
  responseMiddleware
);

export { router };
