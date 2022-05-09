import {
  AllowNull,
  BelongsTo,
  Column,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { User } from './user.model';

@Table
export class Session extends Model {
  @ForeignKey(() => User)
  @AllowNull(false)
  @Column
  public userId!: number;

  @BelongsTo(() => User)
  public user!: User;

  @AllowNull(false)
  @Column
  public token!: string;
}
