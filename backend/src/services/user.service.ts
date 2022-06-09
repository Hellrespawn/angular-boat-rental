import { resourceLimits } from 'worker_threads';
import { UserDao, UserModel } from '../database/user.dao';
import { User } from '../model/user';

export class UserService {
  private userDao: UserDao = new UserDao();

  /**
   * Attempts to get a user identified by email
   * @param email
   * @returns User if it exists, or null
   */
  public async getUserByEmail(email: string): Promise<User | null> {
    return this.userDao.getUserByEmail(email);
  }

  /**
   * Attempts to get a user identified by id
   * @param id
   * @returns User if it exists, or null
   */
  public async getUserById(id: number): Promise<User | null> {
    return this.userDao.getUserById(id);
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

  // TODO: functie moet nog naar de DAO
  public async checkEmail(email: string): Promise<UserModel | null> {
    const emailAd = await UserModel.findOne({ where: { emailAddress: email } });
    if (emailAd !== null) {
      console.log('email found');
    }
    return emailAd;
  }

  public async calculateIfAdmin(): Promise<number> {
    const userCount = UserModel.count();
    return userCount;
  }

  public async createNewUser(
    firstName: string,
    lastName: string,
    license: boolean,
    emailAddress: string,
    password: string,
    blocked: boolean
  ): Promise<UserModel> {
    const isAdmin = (await this.calculateIfAdmin()) ? false : true;
    const newUser = await User.create(
      firstName,
      lastName,
      license,
      emailAddress,
      password,
      false,
      isAdmin
    );
    return this.userDao.createNewUser(
      newUser.firstName,
      newUser.lastName,
      newUser.license,
      newUser.emailAddress,
      newUser.password,
      false,
      isAdmin
    );
  }
}
