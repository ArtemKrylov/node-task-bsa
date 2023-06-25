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
      // console.log("data: ", data);
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
      const fighterData = req.body;
      if (!fighterData.health) {
        fighterData.health = 100;
      }
      console.log(
        "doesFighterExist: ",
        fighterService.doesFighterExist(fighterData)
      );
      if (fighterService.doesFighterExist(fighterData)) {
        updateFighterValid(req, res, next);
      } else {
        createFighterValid(req, res, next);
      }

      // res.send(fighterService.createFighter(fighterData));
    } catch (error) {
      res.err = error;
    } finally {
      next();
    }
  },
  responseMiddleware
);

export { router };
