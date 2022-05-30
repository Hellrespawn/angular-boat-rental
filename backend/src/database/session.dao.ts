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
  public async saveSession(session: Session): Promise<void> {
    await SessionModel.create({
      sessionId: session.sessionId,
      userId: session.user.id,
    });
  }

  public async getSession(sessionId: string): Promise<Session | null> {
    const model = await SessionModel.findOne({ where: { sessionId } });
    return model ? Session.fromModel(model) : null;
  }
}

@Table
export class SessionModel extends Model {
  @AllowNull(false)
  @Column
  public sessionId!: string;

  @AllowNull(false)
  @Column
  @ForeignKey(() => UserModel)
  private userId!: number;

  @BelongsTo(() => UserModel)
  public user!: UserModel;

  @CreatedAt
  public createdAt!: Date;
}
