import { UserDao, UserModel } from '../database/user.dao';
import { User } from '../model/user';
export class UserService {
  private userDao: UserDao = new UserDao();

  public async getUser(email: string): Promise<User | null> {
    return this.userDao.getUser(email);
  }

  /**
   * returns all Users from the database
   */
  public async returnAllUsers(): Promise<Array<User>> {
    return (await this.userDao.getUsers()).map((userModel) => {
      return User.fromModel(userModel);
    });
  }

  /**
   * updates the blocked boolean of a specific User found by id
   * @param idOfUser id of user to be updated
   * @param updatedValue new value of the blocked boolean
   */
  public async updateBlockedValueOfUser(
    idOfUser: number,
    updatedValue: boolean
  ): Promise<void> {
    return this.userDao.updateBlockedValueOfUser(idOfUser, updatedValue);
  }

  /**
   * delete a User found by id
   * @param idOfUser the id of the user to be deleted
   */
  public async deleteUser(idOfUser: number): Promise<void> {
    return this.userDao.deleteUser(idOfUser);
  }
}
