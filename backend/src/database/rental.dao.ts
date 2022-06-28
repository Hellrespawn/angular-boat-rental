import { Op } from 'sequelize';

import { UserModel } from './user.model';
import { BoatModel } from './boat.model';
import { Rental } from '../model/rental';
import { RentalModel } from './rental.model';

export class RentalDao {
  private static instance?: RentalDao;

  private constructor() {
    // Intentionally left blank
  }

  public static getInstance(): RentalDao {
    if (!this.instance) {
      this.instance = new RentalDao();
    }

    return this.instance;
  }

  /**
   * Gets all rentals associated with boatId
   *
   * @param boatId
   * @returns array of Rentals
   */
  public async getRentalsByBoatId(boatId: number): Promise<Rental[]> {
    const models = await RentalModel.findAll({
      where: { boatId },
      include: [BoatModel, UserModel],
    });

    return models.map((model) => Rental.fromModel(model));
  }

  /**
   * Gets all rentals associated with userId
   *
   * @param userId
   * @returns array of Rentals
   */
  public async getRentalsByUserId(userId: number): Promise<Rental[]> {
    const models = await RentalModel.findAll({
      where: { userId },
      include: [BoatModel, UserModel],
    });
    return models.map((model) => Rental.fromModel(model));
  }

  /**
   * Gets all upcoming rentals associated with userId
   *
   * @param userId
   * @returns array of Rentals
   */
  public async getUpcomingRentalsByUserId(userId: number): Promise<Rental[]> {
    const now = new Date();

    const models = await RentalModel.findAll({
      include: [BoatModel, UserModel],
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

    return models.map((model) => Rental.fromModel(model));
  }

  /**
   * Save rental to database
   * @param rental
   * @returns
   */
  public async saveRental(rental: Rental): Promise<number> {
    const model = await RentalModel.create({
      boatId: rental.boat.id,
      userId: rental.user.id,
      dateStart: rental.dateStart,
      dateEnd: rental.dateEnd,
      paid: rental.paid,
    });

    return model.id as number;
  }
}
