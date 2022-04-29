import { Rental } from '../model/rental.model';

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
    return Rental.create({
      boatId,
      userId,
      dateStart,
      dateEnd,
      paid: false,
    });
  }
}
