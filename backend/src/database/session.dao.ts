import {
  AllowNull,
  BelongsTo,
  Column,
  CreatedAt,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Session } from '../model/session';
import { UserModel } from './user.dao';

export class SessionDao {
  private static instance: SessionDao;

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
  public async getAllSessions(): Promise<Session[]> {
    const models = await SessionModel.findAll({ include: [UserModel] });
    return Promise.all(models.map(Session.fromModel));
  }

  /**
   * Get the session defined by sessionId.
   *
   * @param sessionId
   * @returns session or null
   */
  public async getSession(sessionId: string): Promise<Session | null> {
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
  public async saveSession(session: Session): Promise<void> {
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
  public async deleteSession(session: Session): Promise<boolean> {
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
    return models.map(Session.fromModel);
  }
}

@Table
export class SessionModel extends Model {
  @AllowNull(false)
  @Column
  public readonly sessionId!: string;

  @AllowNull(false)
  @Column
  @ForeignKey(() => UserModel)
  private userId!: number;

  @BelongsTo(() => UserModel)
  public readonly user!: UserModel;

  @CreatedAt
  public readonly createdAt!: Date;
}
