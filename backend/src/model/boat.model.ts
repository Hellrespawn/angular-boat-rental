import {
  Table,
  Column,
  Model,
  DataType,
  AllowNull,
  Unique,
  HasMany,
} from 'sequelize-typescript';
import { Rental } from './rental.model';

export type BoatType = 'sail' | 'motor';

// This is a type instead of an interface because Sequelize complains with:
//
// Argument of type 'BoatData' is not assignable to parameter of type 'Optional<any, string>'.
// Type 'BoatData' is not assignable to type 'Omit<any, string>'.
//  Index signature for type 'number' is missing in type 'BoatData'.
//
// If it's an interface.
export type BoatData = {
  name: string;
  registrationNumber: number;
  pricePerDay: number;
  skipperRequired: boolean;
  maintenance: boolean;
  imageRoute: string;
  lengthInM: number;
  maxOccupants: number;
  boatType: BoatType;
  maxSpeedInKmH?: number;
  sailAreaInM2?: number;
};

export type BoatRequirements = 'none' | 'license' | 'skipper';

// Not familiar with a way to construct this from the above type.
const BOAT_TYPES = ['sail', 'motor'];

@Table
export class Boat extends Model implements BoatData {
  @AllowNull(false) @Unique @Column public name!: string;
  @AllowNull(false) @Unique @Column public registrationNumber!: number;
  @AllowNull(false) @Column public pricePerDay!: number;
  @AllowNull(false) @Column public skipperRequired!: boolean;
  @AllowNull(false) @Column public maintenance!: boolean;

  // Could not get this to work with the getter being transformed, so the
  // transformed value is saved in the database.
  @AllowNull(false)
  @Column
  public get imageRoute(): string {
    return this.getDataValue('imageRoute');
  }

  public set imageRoute(imageRoute: string) {
    this.setDataValue('imageRoute', `/images/${imageRoute}`);
  }

  @AllowNull(false) @Column public lengthInM!: number;
  @AllowNull(false) @Column public maxOccupants!: number;

  @AllowNull(false)
  @Column(DataType.ENUM(...BOAT_TYPES))
  public boatType!: BoatType;

  @Column public maxSpeedInKmH?: number;
  @Column public sailAreaInM2?: number;

  @HasMany(() => Rental)
  public rentals!: Rental[];

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
    } else if (this.boatType == 'sail' && this.sailAreaInM2! > 150) {
      requirements = 'license';
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
    // If the boat instance was eagerly loaded, this.rentals will be defined,
    // else, it loads it here.
    const rentals = this.rentals ?? (await this.$get('rentals'));

    return rentals.every((r) => !r.areDatesOverlapping(dateStart, dateEnd));
  }

  /**
   * Returns an all booked dates.
   *
   * @returns array of booked dates
   */
  public async getBookedDates(): Promise<Date[]> {
    const rentals = this.rentals ?? (await this.$get('rentals'));
    return rentals.flatMap((rental) => rental.getDates());
  }
}
