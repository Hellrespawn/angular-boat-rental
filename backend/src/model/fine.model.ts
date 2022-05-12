import {
  Table,
  Column,
  Model,
  AllowNull,
  BelongsTo,
  ForeignKey,
} from 'sequelize-typescript';
import { User } from './user.model';

@Table
export class Fine extends Model {
  @ForeignKey(() => User)
  @AllowNull(false)
  @Column
  public userID!: number;

  @BelongsTo(() => User)
  public user!: User;

  @Column public amount!: number;

  @Column public paid!: boolean;
}
