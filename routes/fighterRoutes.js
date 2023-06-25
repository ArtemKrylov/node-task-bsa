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
      if (fighterService.doesFighterExist(fighterData)) {
        updateFighterValid(req, res, next);
      } else {
        createFighterValid(req, res, next);
      }
    } catch (error) {
      res.err = error;
    } finally {
      next();
    }
  },
  responseMiddleware
);

router.get(
  "/:id",
  (req, res, next) => {
    try {
      const id = req.params.id;
      if (fighterService.doesFighterExistById(id)) {
        const data = fighterService.getFighterById(id);
        res.send(data);
      } else {
        throw new Error("Fighter with such id does not exist!");
      }
    } catch (error) {
      res.status(404).send(error.message);
    } finally {
      next();
    }
  },
  responseMiddleware
);

router.put(
  "/:id",
  (req, res, next) => {
    try {
      const id = req.params.id;
      const data = req.body;
      if (fighterService.doesFighterExistById(id)) {
        res.send(fighterService.updateFighterById(id, data));
      } else {
        throw new Error("Fighter with such id does not exist!");
      }
    } catch (error) {
      res.status(404).send(error.message);
    } finally {
      next();
    }
  },
  responseMiddleware
);

router.delete(
  "/:id",
  (req, res, next) => {
    try {
      const id = req.params.id;
      if (fighterService.doesFighterExistById(id)) {
        const data = fighterService.deleteFighterById(id);
        res.send(data);
      } else {
        throw new Error("Fighter with such id does not exist!");
      }
    } catch (error) {
      res.status(404).send(error.message);
    } finally {
      next();
    }
  },
  responseMiddleware
);

export { router };
