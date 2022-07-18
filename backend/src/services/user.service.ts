import { UserDao } from '../persistence/user.dao';
import { User } from '../model/user';
import { ServerError } from '../util/error';
import { type UserOverviewData } from 'auas-common';

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

  public async register(
    firstName: string,
    lastName: string,
    license: boolean,
    emailAddress: string,
    password: string
  ): Promise<void> {
    if (await this.checkEmailExists(emailAddress)) {
      throw new ServerError(
        'There is already a user with this e-mail address!'
      );
    }

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

  public async getOverviewData(): Promise<UserOverviewData[]> {
    const users = await this.userDao.getAll();

    return users.map((user) => this.UserToUserOverviewData(user));
  }

  public getByEmail(email: string): Promise<User | null> {
    return this.userDao.getByEmail(email);
  }

  public getById(id: number): Promise<User | null> {
    return this.userDao.getById(id);
  }

  public checkEmailExists(emailAddress: string): Promise<boolean> {
    return this.userDao.checkEmailExists(emailAddress);
  }

  public async isNewUserAdmin(): Promise<boolean> {
    const userCount = await this.userDao.count();
    return !userCount;
  }

  public delete(id: number): Promise<number> {
    return this.userDao.delete(id);
  }

  public async toggleBlocked(id: number): Promise<boolean> {
    const user = await this.userDao.getById(id);

    if (!user) {
      throw new ServerError(`There is no user with id ${id}`);
    }

    await this.userDao.updateBlocked(id, !user.blocked);

    return !user.blocked;
  }

  private UserToUserOverviewData(user: User): UserOverviewData {
    const { id, emailAddress, firstName, lastName, license, blocked, admin } =
      user;

    return {
      id,
      emailAddress,
      firstName,
      lastName,
      license,
      blocked,
      admin,
    };
  }
}
