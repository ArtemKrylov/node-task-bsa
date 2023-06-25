import { fighterRepository } from "../repositories/fighterRepository.js";

class FighterService {
  // TODO: Implement methods to work with fighters

  createFighter(data) {
    return fighterRepository.create(data);
  }
  updateFighter(data) {
    const foundFighter = fighterRepository
      .getAll()
      .find((fighter) => fighter.name === data.name);
    const id = foundFighter.id;
    return fighterRepository.update(id, data);
  }
  getAllFighters() {
    return fighterRepository.getAll();
  }
  findFigther(data) {
    return fighterRepository.getOne(data);
  }
  doesFighterExist(data) {
    return Boolean(
      fighterRepository.getAll().find((el) => el.name === data.name)
    );
  }
}

const fighterService = new FighterService();

export { fighterService };
