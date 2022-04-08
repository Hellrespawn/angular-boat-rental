import {
  Table,
  Column,
  Model,
  DataType,
  AllowNull,
  Unique,
} from 'sequelize-typescript';
import { IMAGE_ROUTE } from '../routes/image.routes';

// This is a type instead of an interface because Sequelize complains with:
//
// Argument of type 'BoatData' is not assignable to parameter of type 'Optional<any, string>'.
// Type 'BoatData' is not assignable to type 'Omit<any, string>'.
//  Index signature for type 'number' is missing in type 'BoatData'.
//
// If it's an interface.
export type BoatData = {
  name: string;
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

const BOAT_TYPE = DataType.ENUM('sail', 'motor');

// const IMAGE_TYPE = DataType.ENUM('jpg', 'png');

@Table
export class Boat extends Model implements BoatData {
  @Unique @Column public name!: string;

  @Column public pricePerDay!: number;

  @Column public skipperRequired!: boolean;

  @Column public maintenance!: boolean;

  // Could not get this to work with the getter being transformed, so the
  // transformed value is saved in the database.
  @Column
  public get imageRoute(): string {
    return this.getDataValue('imageRoute');
  }

  public set imageRoute(imageRoute: string) {
    this.setDataValue('imageRoute', `/${IMAGE_ROUTE}/${imageRoute}`);
  }

  @Column public lengthInM!: number;

  @Column public maxOccupants!: number;

  @Column(BOAT_TYPE) public boatType!: string;

  @AllowNull @Column public maxSpeedInKmH?: number;

  @AllowNull @Column public sailAreaInM2?: number;
}
