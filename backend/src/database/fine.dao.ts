import {
  Table,
  Column,
  Model,
  AllowNull,
  BelongsTo,
  ForeignKey,
} from 'sequelize-typescript';
import { Fine } from '../model/fine';
import { UserModel } from './user.dao';

export class FineDao {
  /**
   * returns all Fines in the database
   */
  public async returnAllFines(): Promise<Array<FineModel>> {
    return FineModel.findAll();
  }

  /**
   * adds a new fine to the database
   * @param userID id of the user of the new fine
   * @param amount amount of money
   * @param paid boolean about whether the fine is paid or not
   */
  public async addFine(newFine: Fine): Promise<void> {
    await FineModel.create({
      userId: newFine.userId,
      amount: newFine.amount,
      paid: newFine.paid,
    });
  }
}

@Table
export class FineModel extends Model {
  @ForeignKey(() => UserModel)
  @AllowNull(false)
  @Column
  public userId!: number;

  @BelongsTo(() => UserModel)
  public user!: UserModel;

  @Column public amount!: number;

  @Column public paid!: boolean;
}
