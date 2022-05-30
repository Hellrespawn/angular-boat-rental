import {
  Table,
  Column,
  Model,
  AllowNull,
  BelongsTo,
  ForeignKey,
} from 'sequelize-typescript';
import { UserModel } from './user.dao';

@Table
export class FineModel extends Model {
  @ForeignKey(() => UserModel)
  @AllowNull(false)
  @Column
  public userID!: number;

  @BelongsTo(() => UserModel)
  public user!: UserModel;

  @Column public amount!: number;

  @Column public paid!: boolean;
}
