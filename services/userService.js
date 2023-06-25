import { userRepository } from "../repositories/userRepository.js";

class UserService {
  // TODO: Implement methods to work with user

  createUser(user) {
    return userRepository.create(user);
  }

  updateUser(user) {
    const id = UserService.findUser(user);
    return userRepository.update(id, user);
  }

  deleteUser(user) {
    const id = UserService.findUser(user);
    return userRepository.delete(id);
  }

  static findUser(user) {
    const foundUser = userRepository
      .getAll()
      .find(
        (el) => user.email === el.email || user.phoneNumber === el.phoneNumber
      );
    return foundUser ? foundUser.id : false;
  }

  doesUserExist(user) {
    return Boolean(UserService.findUser(user));
  }

  search(search) {
    const item = userRepository.getOne(search);
    if (!item) {
      return null;
    }
    return item;
  }
}

const userService = new UserService();

export { userService };
