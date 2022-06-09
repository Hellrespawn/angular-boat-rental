import { BoatModel, BoatRequirements, BoatType } from 'src/database/boat.dao';
import { RentalDao } from '../database/rental.dao';
import { Rental } from './rental';

export class Boat {
  constructor(
    public id: number,
    public name: string,
    public registrationNumber: number,
    public pricePerDay: number,
    public skipperRequired: boolean,
    public maintenance: boolean,
    public imageRoute: string,
    public lengthInM: number,
    public maxOccupants: number,
    public boatType: BoatType,
    public maxSpeedInKmH?: number,
    public sailAreaInM2?: number
  ) {}

  public static fromModel(boatModel: BoatModel): Boat {
    return new Boat(
      boatModel.id,
      boatModel.name,
      boatModel.registrationNumber,
      boatModel.pricePerDay,
      boatModel.skipperRequired,
      boatModel.maintenance,
      boatModel.imageRoute,
      boatModel.lengthInM,
      boatModel.maxOccupants,
      boatModel.boatType,
      boatModel.maxSpeedInKmH,
      boatModel.sailAreaInM2
    );
  }

  public async getRentals(): Promise<Rental[]> {
    return await new RentalDao().getRentalsByBoatId(this.id);
  }

  /**
   * Calculates the boat's requirements.
   *
   * @returns the boat's requirements.
   */
  public getRequirements(): BoatRequirements {
    let requirements: BoatRequirements = 'none';

    if (this.skipperRequired) {
      requirements = 'skipper';
    } else if (this.maxOccupants > 12) {
      requirements = 'license';
      // This is required by the sequelize models
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    } else if (this.boatType == 'sail' && this.sailAreaInM2! > 150) {
      requirements = 'license';
      // This is required by the sequelize models
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    } else if (this.boatType == 'motor' && this.maxSpeedInKmH! > 20) {
      requirements = 'license';
    }

    return requirements;
  }

  /**
   * Checks all rentals for this boat to see if it's available.
   *
   * @param dateStart start of period to check
   * @param dateEnd end of period to check
   * @returns whether or not the boat is available
   */
  public async isAvailable(dateStart: Date, dateEnd: Date): Promise<boolean> {
    const rentals = await this.getRentals();
    return rentals.every((r) => !r.areDatesOverlapping(dateStart, dateEnd));
  }

  /**
   * Returns an all booked dates.
   *
   * @returns array of booked dates
   */
  public async getBookedDates(): Promise<Date[]> {
    const rentals = await this.getRentals();

    return rentals.flatMap((rental) => rental.getDates());
  }
}
