import { Rental } from '../model/rental.model';

export class RentalService {
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
