import {
  AllowNull,
  BelongsTo,
  Column,
  ForeignKey,
  Model,
  Table,
  Default,
} from 'sequelize-typescript';
import { BoatModel } from './boat.model';
import { UserModel } from './user.model';

@Table
export class RentalModel extends Model {
  @ForeignKey(() => BoatModel)
  @AllowNull(false)
  @Column
  public readonly boatRegistrationNumber!: number;

  @BelongsTo(() => BoatModel)
  public readonly boat!: BoatModel;

  @ForeignKey(() => UserModel)
  @AllowNull(false)
  @Column
  public readonly userId!: number;

  @BelongsTo(() => UserModel)
  public readonly user!: UserModel;

  @AllowNull(false)
  @Column
  public readonly dateStart!: Date;

  @AllowNull(false)
  @Column
  public readonly dateEnd!: Date;

  @Default(false)
  @Column
  public paid!: boolean;
}
