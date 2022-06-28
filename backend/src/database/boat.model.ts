import {
  Table,
  Column,
  Model,
  DataType,
  AllowNull,
  Unique,
  HasMany,
} from 'sequelize-typescript';
import { type Boat, MotorBoat, SailBoat } from '../model/boat';
import { RentalModel } from './rental.model';

// Not familiar with a way to construct this from the above type.
const BOAT_TYPES = ['sail', 'motor'];

export type BoatType = typeof BOAT_TYPES[number];

export type BoatRequirements = 'none' | 'license';

@Table
export class BoatModel extends Model {
  @AllowNull(false) @Unique @Column public name!: string;

  // TODO Make this primary key
  @AllowNull(false) @Unique @Column public registrationNumber!: number;

  @AllowNull(false) @Column public pricePerDay!: number;

  @AllowNull(false) @Column public lengthInM!: number;

  @AllowNull(false) @Column public maxOccupants!: number;

  @AllowNull(false)
  @Column(DataType.ENUM(...BOAT_TYPES))
  public boatType!: BoatType;

  @Column public maxSpeedInKmH?: number;

  @Column public sailAreaInM2?: number;

  @HasMany(() => RentalModel)
  public rentals!: RentalModel[];

  // FIXME Could not get this to work with the getter being transformed, so the
  // FIXME transformed value is saved in the database.
  @AllowNull(false)
  @Column
  public get imageRoute(): string {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this.getDataValue('imageRoute');
  }

  public set imageRoute(imageRoute: string) {
    this.setDataValue('imageRoute', `/images/${imageRoute}`);
  }

  /**
   * Covert `BoatModel` to `Boat`
   * @returns `Boat`
   */
  public toBoat(): Boat {
    if (this.boatType === 'motor') {
      return new MotorBoat(
        this.id as number,
        this.name,
        this.registrationNumber,
        this.pricePerDay,
        this.imageRoute,
        this.lengthInM,
        this.maxOccupants,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        this.maxSpeedInKmH!
      );
    }

    return new SailBoat(
      this.id as number,
      this.name,
      this.registrationNumber,
      this.pricePerDay,
      this.imageRoute,
      this.lengthInM,
      this.maxOccupants,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      this.sailAreaInM2!
    );
  }
}
