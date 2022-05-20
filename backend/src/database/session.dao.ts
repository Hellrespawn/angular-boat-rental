import { Request, Response } from 'express';
import { Model } from 'sequelize-typescript';

class LoginController {
  private sessionService: SessionService = new SessionService();

  public async login(req: Request, res: Response): Promise<void> {
    // get vars from req
    //
    const session = await this.sessionService.login('username', 'password');
    //
    // put session into cookie or handle error
  }
}

class SessionService {
  private userService: UserService = new UserService();
  private sessionDao: SessionDao = new SessionDao();

  public async login(email: string, password: string): Promise<Session> {
    const user = await this.userService.getUser(email);

    if (!user || !user.verifyPassword(password)) {
      throw '401';
    }

    const session = Session.createSessionForUser(user);

    await this.sessionDao.saveSession(session);

    return session;
  }
}

class Session {
  public static createSessionForUser(user: User): Session {
    return new Session();
  }
}

class SessionDao {
  public async saveSession(session: Session): Promise<void> {
    await SessionModel.create({ ...session });
  }
}

class SessionModel extends Model {}

class UserService {
  private userDao: UserDao = new UserDao();

  public async getUser(email: string): Promise<User | null> {
    return this.userDao.getUser(email);
  }
}

class User {
  public static fromModel(model: UserModel): User {
    return new User();
  }

  public verifyPassword(password: string): boolean {
    return true;
  }
}

class UserDao {
  public async getUser(email: string): Promise<User | null> {
    const model = await UserModel.findOne();

    if (model) {
      return User.fromModel(model);
    }

    throw 'User not found!';
  }
}
class UserModel extends Model {}
