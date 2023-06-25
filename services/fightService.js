import { fightRepository } from "../repositories/fightRepository.js";

class FightersService {
  // OPTIONAL TODO: Implement methods to work with fights

  createFight(data) {
    return fightRepository.create(data);
  }

  finishFight(id, winner) {
    const fight = fightRepository.getAll().find((el) => el.id === id);
    fight.log = [{ winner }];
    return fightRepository.update(id, fight);
  }
}

const fightersService = new FightersService();

export { fightersService };
