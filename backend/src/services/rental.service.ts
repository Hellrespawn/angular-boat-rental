import { Rental } from '../model/rental.model';

export class RentalService {
  /**
   * Creates a new rental
   *
   * @param boatId
   * @param customerId
   * @param dateStart
   * @param dateEnd
   * @returns new Rental
   */
  public async addRental(
    boatId: number,
    customerId: number,
    dateStart: Date,
    dateEnd: Date
  ): Promise<Rental> {
    return Rental.create({
      boatId,
      customerId,
      dateStart,
      dateEnd,
      paid: false,
    });
  }
}
