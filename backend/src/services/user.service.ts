import { UserDao, UserModel } from '../database/user.dao';
import { User } from '../model/user';

export class UserService {
  private userDao: UserDao = new UserDao();

  /**
   * Attempts to get a user identified by email
   * @param email
   * @returns User if it exists, or null
   */
  public async getUser(email: string): Promise<User | null> {
    return this.userDao.getUser(email);
  }

  /**
   * returns all Users from the database
   */
  public async returnAllUsers(): Promise<Array<User>> {
    return this.userDao.getUsers();
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

  public async checkEmail(email: string): Promise<UserModel | null> {
    const emailAd = await UserModel.findOne({ where: { emailAddress: email } });
    if (emailAd !== null) {
      console.log('email found');
    }
    return emailAd;
  }

  public getUserCountfromDB(): Promise<number> {
    const usercount = UserModel.count();
    return usercount;
  }

  public async createnewUser(
    firstName: string,
    lastName: string,
    license: boolean,
    emailAddress: string,
    password: string,
    blocked: boolean,
    admin: boolean
  ): Promise<UserModel> {
    const isAdmin = (await this.getUserCountfromDB()) ? false : true;
    const isNewUser = await User.createWithPlaintextPassword(
      firstName,
      lastName,
      license,
      emailAddress,
      password,
      blocked,
      admin
    );
    const result = await UserModel.create({
      isAdmin,
      isNewUser,
      firstName: firstName,
      lastName: lastName,
      license: false,
      emailAddress: emailAddress,
      password: await User.hashPassword(password),
      blocked: false,
      admin: false,
    });
    return result;
  }
}
