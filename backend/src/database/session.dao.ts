import { Session } from '../model/session';
import { SessionModel } from './session.model';
import { UserModel } from './user.model';

export class SessionDao {
  private static instance?: SessionDao;

  private constructor() {
    // Intentionally left blank
  }

  public static getInstance(): SessionDao {
    if (!this.instance) {
      this.instance = new SessionDao();
    }

    return this.instance;
  }

  /**
   * @returns all sessions.
   */
  public async getAll(): Promise<Session[]> {
    const models = await SessionModel.findAll({ include: [UserModel] });

    return Promise.all(models.map((model) => Session.fromModel(model)));
  }

  /**
   * Get the session defined by sessionId.
   *
   * @param sessionId
   * @returns session or null
   */
  public async getBySessionId(sessionId: string): Promise<Session | null> {
    const model = await SessionModel.findOne({
      where: { sessionId },
      include: [UserModel],
    });
    return model ? Session.fromModel(model) : null;
  }

  /**
   * Save session to database.
   * @param session
   */
  public async save(session: Session): Promise<void> {
    await SessionModel.create({
      sessionId: session.sessionId,
      userId: session.user.id,
    });
  }

  /**
   * Deletes session
   * @param session
   * @returns
   */
  public async delete(session: Session): Promise<boolean> {
    return Boolean(await SessionModel.destroy({ where: { id: session.id } }));
  }

  /**
   * Get the session associated with userId.
   *
   * @param userId
   * @returns session or null
   */
  public async getSessionsByUserId(userId: number): Promise<Session[]> {
    const models = await SessionModel.findAll({
      where: { userId },
      include: [UserModel],
    });
    return models.map((model) => Session.fromModel(model));
  }
}
