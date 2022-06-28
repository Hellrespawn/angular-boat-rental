import { UserDao } from '../database/user.dao';
import { UserModel } from '../database/user.model';
import { User } from '../model/user';

export class UserService {
  private static instance?: UserService;

  private constructor(private userDao = UserDao.getInstance()) {
    // Intentionally left blank
  }

  public static getInstance(): UserService {
    if (!this.instance) {
      this.instance = new UserService();
    }

    return this.instance;
  }

  public async getByEmail(email: string): Promise<User | null> {
    return this.userDao.getByEmail(email);
  }

  public async getById(id: number): Promise<User | null> {
    return this.userDao.getById(id);
  }

  public async save(
    firstName: string,
    lastName: string,
    license: boolean,
    emailAddress: string,
    password: string
  ): Promise<void> {
    const user = await User.create(
      firstName,
      lastName,
      license,
      emailAddress,
      password,
      false,
      await this.isNewUserAdmin()
    );

    await this.userDao.save(user);
  }

  public async checkEmailExists(email: string): Promise<UserModel | null> {
    return this.userDao.checkEmailExists(email);
  }

  public async isNewUserAdmin(): Promise<boolean> {
    const userCount = await this.userDao.count();
    return !userCount;
  }

  public async delete(id: number): Promise<void> {
    return this.userDao.deleteUser(id);
  }
}
