import { RentalDao } from '../database/rental.dao';

import { ServerError } from '../util/error';
import { BoatService } from './boat.service';
import { UserService } from './user.service';
import { Rental } from '../model/rental';

export class RentalService {
  private boatService = new BoatService();

  private userService = new UserService();

  private rentalDao = new RentalDao();

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
  ): Promise<Rental> {
    // Check boat exists
    const boat = await this.boatService.getById(boatId);

    if (!boat) {
      throw new ServerError(`No boat with id ${boatId}.`);
    }

    // Check user exists
    const user = await this.userService.getUserById(userId);

    if (!user) {
      throw new ServerError(`No user with id ${userId}.`);
    }

    // Check dates are valid
    if (Rental.days(dateStart, dateEnd) < 3) {
      throw new ServerError('Rental period must be at least three days!');
    }

    // Check if boat is available (most performance intensive, so last)
    const isAvailable = await boat.isAvailable(dateStart, dateEnd);

    if (!isAvailable) {
      throw new ServerError(
        `Boat is not available from ${dateStart} to ${dateEnd}`
      );
    }

    const rental = new Rental(-1, boat, user, dateStart, dateEnd, false);

    await this.rentalDao.saveRental(rental);

    return rental;
  }

  public async getNextRentalByUserId(userId: number): Promise<Rental | null> {
    const upcoming = await this.rentalDao.getUpcomingRentalsByUserId(userId);

    return upcoming[0] ?? null;
  }
}
