import {
  Table,
  Column,
  Model,
  DataType,
  AllowNull,
  Unique,
  HasMany,
} from 'sequelize-typescript';
import { Boat } from 'src/model/boat';
import { RentalModel } from './rental.dao';

export type BoatType = 'sail' | 'motor';

export type BoatRequirements = 'none' | 'license' | 'skipper';

// Not familiar with a way to construct this from the above type.
const BOAT_TYPES = ['sail', 'motor'];

export class BoatDao {
  public async getBoats(): Promise<BoatModel[]> {
    return BoatModel.findAll();
  }
  public async saveNewBoat(newBoat: Boat): Promise<void> {
    BoatModel.create({
      name: newBoat.name,
      registrationNumber: newBoat.registrationNumber,
      pricePerDay: newBoat.pricePerDay,
      skipperRequired: newBoat.skipperRequired,
      maintenance: newBoat.maintenance,
      imageRoute: newBoat.imageRoute,
      lengthInM: newBoat.lengthInM,
      maxOccupants: newBoat.maxOccupants,
      boatType: newBoat.boatType,
      maxSpeedInKmH: newBoat.maxSpeedInKmH ?? null,
      sailAreaInM2: newBoat.sailAreaInM2 ?? null,
    });
  }
  public async updateMaintenanceValueInBoat(
    idOfBoat: number,
    updatedValue: boolean
  ): Promise<void> {
    const boatToUpdate: BoatModel | null = await BoatModel.findByPk(idOfBoat);
    if (boatToUpdate !== null) {
      boatToUpdate.maintenance = updatedValue;
      boatToUpdate.save();
    } else {
      throw 'Boat not found';
    }
  }
  public async deleteBoat(idOfBoat: number): Promise<void> {
    const boatToDelete: BoatModel | null = await BoatModel.findByPk(idOfBoat);
    if (boatToDelete !== null) {
      boatToDelete.destroy();
    } else {
      throw 'Boat not found';
    }
  }
}

@Table
export class BoatModel extends Model {
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

  @HasMany(() => RentalModel)
  public rentals!: RentalModel[];

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
