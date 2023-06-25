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

  deleteFighter(data) {
    const foundFighter = fighterRepository
      .getAll()
      .find((fighter) => fighter.name === data.name);
    const id = foundFighter.id;
    return fighterRepository.delete(id);
  }

  getAllFighters() {
    return fighterRepository.getAll();
  }

  getFighterById(id) {
    return fighterRepository.getAll().find((fighter) => fighter.id === id);
  }

  updateFighterById(id, data) {
    return fighterRepository.update(id, data);
  }

  deleteFighterById(id) {
    return fighterRepository.delete(id);
  }

  findFigther(data) {
    return fighterRepository.getOne(data);
  }

  doesFighterExist(data) {
    return Boolean(
      fighterRepository.getAll().find((el) => el.name === data.name)
    );
  }

  doesFighterExistById(id) {
    return Boolean(fighterRepository.getAll().find((el) => el.id === id));
  }
}

const fighterService = new FighterService();

export { fighterService };
