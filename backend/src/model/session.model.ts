import { randomBytes } from 'crypto';
import {
  AllowNull,
  BelongsTo,
  Column,
  CreatedAt,
  Default,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { User } from './user.model';

@Table
export class Session extends Model {
  @Default(Session.generateSessionId)
  @Column
  public sessionId!: string;

  @AllowNull(false)
  @Column
  @ForeignKey(() => User)
  private userId!: number;

  @BelongsTo(() => User)
  public user!: User;

  @CreatedAt
  public createdAt!: Date;

  private static generateSessionId(): string {
    return randomBytes(16).toString('base64');
  }
}
