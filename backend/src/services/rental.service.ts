import { RentalDao } from '../database/rental.dao';

import { ServerError } from '../util/error';
import { BoatService } from './boat.service';
import { UserService } from './user.service';
import { Rental } from '../model/rental';

export class RentalService {
  private static instance?: RentalService;

  private constructor(
    private boatService = BoatService.getInstance(),
    private userService = UserService.getInstance(),
    private rentalDao = RentalDao.getInstance()
  ) {
    // Intentionally left blank
  }

  public static getInstance(): RentalService {
    if (!this.instance) {
      this.instance = new RentalService();
    }

    return this.instance;
  }

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
    const user = await this.userService.getById(userId);

    if (!user) {
      throw new ServerError(`No user with id ${userId}.`);
    }

    const rental = await Rental.create(boat, user, dateStart, dateEnd);

    const id = await this.rentalDao.saveRental(rental);

    rental.id = id;

    return rental;
  }

  /** Gets the next rental for user with id userId, if any */
  public async getNextRentalByUserId(userId: number): Promise<Rental | null> {
    const upcoming = await this.rentalDao.getUpcomingRentalsByUserId(userId);

    return upcoming[0] ?? null;
  }
}
