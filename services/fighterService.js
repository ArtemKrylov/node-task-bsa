import { fighterRepository } from "../repositories/fighterRepository.js";

class FighterService {
  // TODO: Implement methods to work with fighters

  createFighter(data) {
    return fighterRepository.create(data);
  }
  getAllFighters() {
    return fighterRepository.getAll();
  }
}

const fighterService = new FighterService();

export { fighterService };
