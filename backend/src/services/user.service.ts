import { UserDao, UserModel } from '../database/user.dao';
import { FineModel } from '../database/fine.dao';
import { User } from '../model/user';
export class UserService {
  private userDao: UserDao = new UserDao();

  public async getUser(email: string): Promise<User | null> {
    return this.userDao.getUser(email);
  }

  /**
   * returns all Users from the database
   */
  public async returnAllUsers(): Promise<Array<UserModel>> {
    return await UserModel.findAll({
      include: [FineModel],
    });
  }

  /**
   * updates the blocked boolean of a specific User found by id
   * @param idOfUser id of user to be updated
   * @param updatedValue new value of the blocked boolean
   */
  public async updateUser(
    idOfUser: number,
    updatedValue: boolean
  ): Promise<void> {
    const userToUpdate: UserModel | null = await UserModel.findByPk(idOfUser);
    if (userToUpdate !== null) {
      userToUpdate.blocked = updatedValue;
      await userToUpdate.save();
    } else {
      throw 'User not found';
    }
  }

  /**
   * delete a User found by id
   * @param idOfUser the id of the user to be deleted
   */
  public async deleteUser(idOfUser: number): Promise<void> {
    const userToDelete: UserModel | null = await UserModel.findByPk(idOfUser);
    if (userToDelete !== null) {
      await userToDelete.destroy();
    } else {
      throw 'userToDelete not found';
    }
  }

  public async checkEmail(email: string): Promise<UserModel | null> {
    const emailAd = await UserModel.findOne({ where: { emailAddress: email } });
    if (emailAd !== null) {
      console.log('email found');
    }
    return emailAd;
  }
}
