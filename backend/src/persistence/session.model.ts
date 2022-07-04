import {
  AllowNull,
  BelongsTo,
  Column,
  CreatedAt,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { UserModel } from './user.model';

@Table
export class SessionModel extends Model {
  @AllowNull(false)
  @Column
  public readonly sessionId!: string;

  @BelongsTo(() => UserModel)
  public readonly user!: UserModel;

  @CreatedAt
  public readonly createdAt!: Date;

  @AllowNull(false)
  @Column
  @ForeignKey(() => UserModel)
  private userId!: number;
}
