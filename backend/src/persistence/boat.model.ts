import { type BoatType, BOAT_TYPES } from 'auas-common';
import {
  Table,
  Column,
  Model,
  DataType,
  AllowNull,
  Unique,
  HasMany,
  PrimaryKey,
} from 'sequelize-typescript';
import { type Boat, MotorBoat, SailBoat } from '../model/boat';
import { RentalModel } from './rental.model';

@Table
export class BoatModel extends Model {
  @PrimaryKey @Column public registrationNumber!: number;

  @AllowNull(false)
  @Column(DataType.ENUM(...BOAT_TYPES))
  public boatType!: BoatType;

  @AllowNull(false) @Column public pricePerDay!: number;

  @AllowNull(false) @Column public lengthInM!: number;

  @AllowNull(false) @Column public maxPassengers!: number;

  @AllowNull(false) @Column imageRoute!: string;

  @Unique @Column public name?: string;

  @Column public maxSpeedInKmH?: number;

  @Column public sailAreaInM2?: number;

  @HasMany(() => RentalModel)
  public rentals!: RentalModel[];

  /**
   * Covert `BoatModel` to `Boat`
   * @returns `Boat`
   */
  public toBoat(): Boat {
    const imageRoute = `/images/${this.imageRoute}`;

    if (this.boatType === 'motor') {
      return new MotorBoat(
        this.registrationNumber,
        this.pricePerDay,
        imageRoute,
        this.lengthInM,
        this.maxPassengers,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        this.maxSpeedInKmH!,
        this.name
      );
    }

    return new SailBoat(
      this.registrationNumber,
      this.pricePerDay,
      imageRoute,
      this.lengthInM,
      this.maxPassengers,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      this.sailAreaInM2!,
      this.name
    );
  }
}
