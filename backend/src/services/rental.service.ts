import { Op } from 'sequelize';
import { BoatModel } from '../database/boat.dao';
import { RentalModel } from '../database/rental.dao';
import { SkipperModel } from '../database/skipper.dao';
import { ServerError } from '../util/error';
import { UserModel } from '../database/user.dao';
import { BoatService } from './boat.service';

export class RentalService {
  private boatService = new BoatService();

  /**
   * Creates a new rental
   *
   * @param boatId
   * @param userId
   * @param dateStart
   * @param dateEnd
   * @returns new Rental
   */
  public async addRental(
    boatId: number,
    userId: number,
    dateStart: Date,
    dateEnd: Date
  ): Promise<RentalModel> {
    // Check boat exists
    const boat = await this.boatService.getById(boatId);

    if (!boat) {
      throw new ServerError(`No boat with id ${boatId}.`);
    }

    // Check user exists
    const user = await UserModel.findByPk(userId);

    if (!user) {
      throw new ServerError(`No user with id ${userId}.`);
    }

    // Check dates are valid
    if (RentalModel.days(dateStart, dateEnd) < 3) {
      throw new ServerError('Rental period must be at least three days!');
    }

    // Check if boat is available (most performance intensive, so last)
    const isAvailable = await boat.isAvailable(dateStart, dateEnd);

    if (!isAvailable) {
      throw new ServerError(
        `Boat is not available from ${dateStart} to ${dateEnd}`
      );
    }

    // Create new Rental
    return RentalModel.create({
      boatId,
      userId,
      dateStart,
      dateEnd,
      paid: false,
    });
  }

  public async getNextRentalByUserId(
    userId: number
  ): Promise<RentalModel | null> {
    const now = new Date();

    const rentals = await RentalModel.findAll({
      include: [BoatModel, SkipperModel],
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

    return rentals[0] ?? null;
  }
}
