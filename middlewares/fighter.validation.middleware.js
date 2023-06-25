import { FIGHTER } from "../models/fighter.js";
import { fighterService } from "../services/fighterService.js";

function haveSameKeys(figher, model) {
  const figherKeys = Object.keys(figher);
  const modelKeys = Object.keys(model);
  modelKeys.splice(modelKeys.indexOf("id"), 1);
  if (figherKeys.length !== modelKeys.length) return false;
  figherKeys.forEach((key) => {
    if (!modelKeys.hasOwnProperty(key)) {
      return false;
    }
  });
  return true;
}

function checkFighterValidity(fighter, model) {
  if (
    haveSameKeys(fighter, model) &&
    fighter.power >= 1 &&
    fighter.power <= 100 &&
    fighter.defense >= 1 &&
    fighter.defense <= 100 &&
    fighter.health >= 80 &&
    fighter.health <= 120
  ) {
    return true;
  }
  return false;
}

const createFighterValid = (req, res, next) => {
  // TODO: Implement validatior for FIGHTER entity during creation
  const fighterData = req.body;
  if (checkFighterValidity(fighterData, FIGHTER)) {
    res.send(fighterService.createFighter(fighterData));
  } else {
    res.status(400).send({
      error: true,
      message:
        "Fighter is not valid: 1 <= power <= 100, 1 <= defense <= 100, 80 <= health <= 120",
    });
  }
  next();
};

const updateFighterValid = (req, res, next) => {
  // TODO: Implement validatior for FIGHTER entity during update
  const fighterData = req.body;
  if (checkFighterValidity(fighterData, FIGHTER)) {
    res.send(fighterService.updateFighter(fighterData));
  } else {
    res.status(400).send({
      error: true,
      message:
        "Fighter is not valid: 1 <= power <= 100, 1 <= defense <= 100, 80 <= health <= 120",
    });
  }

  next();
};

export { createFighterValid, updateFighterValid };
