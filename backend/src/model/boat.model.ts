import {
  Table,
  Column,
  Model,
  DataType,
  AllowNull,
  Unique,
  HasMany,
} from 'sequelize-typescript';
import { IMAGE_ROUTE } from '../routes/image.routes';
import { Rental } from './rental.model';

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
  boatType: string;
  maxSpeedInKmH?: number;
  sailAreaInM2?: number;
};

const BOAT_TYPES = ['sail', 'motor'];

export enum BoatRequirements {
  None,
  License,
  Skipper,
}

const BOAT_TYPE = DataType.ENUM(...BOAT_TYPES);

@Table
export class Boat extends Model implements BoatData {
  @AllowNull(false) @Unique @Column public name!: string;

  @AllowNull(false) @Column public registrationNumber!: number;

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
    this.setDataValue('imageRoute', `/${IMAGE_ROUTE}/${imageRoute}`);
  }

  @AllowNull(false) @Column public lengthInM!: number;

  @AllowNull(false) @Column public maxOccupants!: number;

  @AllowNull(false) @Column(BOAT_TYPE) public boatType!: string;

  @Column public maxSpeedInKmH?: number;

  @Column public sailAreaInM2?: number;

  @HasMany(() => Rental)
  public rentals!: Rental[];

  public getRequirements(): string {
    let requirements = 'none';

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
}
