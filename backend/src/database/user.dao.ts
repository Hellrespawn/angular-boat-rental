import { User } from '../model/user';
import { UserModel } from './user.model';

export class UserDao {
  private static instance?: UserDao;

  private constructor() {
    // Intentionally left blank
  }

  public static getInstance(): UserDao {
    if (!this.instance) {
      this.instance = new UserDao();
    }

    return this.instance;
  }

  public async save(user: User): Promise<void> {
    throw new Error('Not yet implemented: UserDao.save');
  }

  public async getById(id: number): Promise<User | null> {
    throw new Error('Not yet implemented: UserDao.getById');
  }

  public async getByEmail(emailAddress: string): Promise<User | null> {
    throw new Error('Not yet implemented: UserDao.getByEmail');
  }

  public async deleteUser(id: number): Promise<void> {
    throw new Error('Not yet implemented: UserDao.delete');
  }

  public async checkEmailExists(email: string): Promise<UserModel | null> {
    throw new Error('Not yet implemented: UserDao.checkEmailExists');
  }

  public async count(): Promise<number> {
    return UserModel.count();
  }
}
