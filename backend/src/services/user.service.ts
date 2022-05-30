import { User } from '../model/user.model';

export class UserService {
  /**
   * returns all Users from the database
   */
  public async returnAllUsers(): Promise<Array<User>> {
    return await User.findAll();
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
    const userToUpdate: User | null = await User.findByPk(idOfUser);
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
    const userToDelete: User | null = await User.findByPk(idOfUser);
    if (userToDelete !== null) {
      await userToDelete.destroy();
    } else {
      throw 'userToDelete not found';
    }
  }

  public async checkEmail(email: string): Promise<User | null> {
    const emailAd = await User.findOne({ where: { emailAddress: email } });
    if (emailAd !== null) {
        console.log('email found')
    }
    return emailAd;
  }
}
