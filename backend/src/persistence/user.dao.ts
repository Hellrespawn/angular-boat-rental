import { User } from '../model/user';
import { ServerError } from '../util/error';
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
    await UserModel.create({
      firstName: user.firstName,
      lastName: user.lastName,
      license: user.license,
      emailAddress: user.emailAddress,
      password: user.password,
      blocked: user.blocked,
      admin: user.admin,
    });
  }

  public delete(id: number): Promise<number> {
    return UserModel.destroy({ where: { id } });
  }

  public async updateBlocked(id: number, blocked: boolean): Promise<void> {
    const model = await UserModel.findOne({ where: { id } });

    if (!model) {
      throw new ServerError(`There is no user with id ${id}`);
    }

    model.blocked = blocked;

    await model.save();
  }

  public async getAll(): Promise<User[]> {
    const models = await UserModel.findAll();
    return models.map((model) => User.fromModel(model));
  }

  public async getById(id: number): Promise<User | null> {
    const model = await UserModel.findOne({ where: { id } });

    return model ? User.fromModel(model) : null;
  }

  public async getByEmail(emailAddress: string): Promise<User | null> {
    const model = await UserModel.findOne({ where: { emailAddress } });

    return model ? User.fromModel(model) : null;
  }

  public async checkEmailExists(emailAddress: string): Promise<boolean> {
    const model = await this.getByEmail(emailAddress);

    return Boolean(model);
  }

  public count(): Promise<number> {
    return UserModel.count();
  }
}
