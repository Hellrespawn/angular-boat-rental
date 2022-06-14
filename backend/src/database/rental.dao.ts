import {
  AllowNull,
  BelongsTo,
  Column,
  ForeignKey,
  Model,
  Table,
  Default,
} from 'sequelize-typescript';
import { UserModel } from './user.dao';
import { BoatModel } from './boat.dao';
import { SkipperModel } from './skipper.dao';
import { Op } from 'sequelize';
import { Rental } from '../model/rental';

export class RentalDao {
  public async getRentalsByBoatId(boatId: number): Promise<Rental[]> {
    const models = await RentalModel.findAll({
      where: { boatId },
      include: [BoatModel, SkipperModel, UserModel],
    });
    return models.map(Rental.fromModel);
  }

  public async getRentalsByUserId(userId: number): Promise<Rental[]> {
    const models = await RentalModel.findAll({
      where: { userId },
      include: [BoatModel, SkipperModel, UserModel],
    });
    return models.map(Rental.fromModel);
  }

  public async getUpcomingRentalsByUserId(userId: number): Promise<Rental[]> {
    const now = new Date();

    const models = await RentalModel.findAll({
      include: [BoatModel, SkipperModel, UserModel],
      where: {
        userId,
        [Op.or]: [
          {
            dateStart: { [Op.gt]: now },
          },
          {
            dateStart: { [Op.lte]: now },
            dateEnd: { [Op.gt]: now },
          },
        ],
      },
      order: [['dateStart', 'ASC']],
    });

    return models.map(Rental.fromModel);
  }

  public async saveRental(rental: Rental): Promise<number> {
    const model = await RentalModel.create({
      boatId: rental.boat.id,
      userId: rental.user.id,
      skipperId: rental.skipper?.id,
      dateStart: rental.dateStart,
      dateEnd: rental.dateEnd,
      paid: rental.paid,
    });

    return model.id;
  }
}

@Table
export class RentalModel extends Model {
  @ForeignKey(() => BoatModel)
  @AllowNull(false)
  @Column
  public boatId!: number;

  @BelongsTo(() => BoatModel)
  public boat!: BoatModel;

  @ForeignKey(() => UserModel)
  @AllowNull(false)
  @Column
  public userId!: number;

  @BelongsTo(() => UserModel)
  public user!: UserModel;

  @ForeignKey(() => SkipperModel)
  @Column
  public skipperId?: number;

  @BelongsTo(() => SkipperModel)
  public skipper?: SkipperModel;

  @AllowNull(false)
  @Column
  public dateStart!: Date;

  @AllowNull(false)
  @Column
  public dateEnd!: Date;

  @Default(false)
  @Column
  public paid!: boolean;
}
