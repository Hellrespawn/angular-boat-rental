import { Boat } from '../model/boat.model';
import { Rental } from '../model/rental.model';
import { User } from '../model/user.model';

export class RentalService {
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
    const boat = await Boat.findByPk(boatId);

    if (!boat) {
      throw `No boat with id ${boatId}.`;
    }

    // Check user exists
    const user = await User.findByPk(userId);

    if (!user) {
      throw `No user with id ${userId}.`;
    }

    // Check dates are valid
    if (Rental.days(dateStart, dateEnd) < 3) {
      throw 'Rental period must be at least three days!';
    }

    // Check if boat is available (most performance intensive, so last)
    const isAvailable = await boat.isAvailable(dateStart, dateEnd);

    if (!isAvailable) {
      throw `Boat is not available from ${dateStart} to ${dateEnd}`;
    }

    // Create new Rental
    return Rental.create({
      boatId,
      userId,
      dateStart,
      dateEnd,
      paid: false,
    });
  }
}
