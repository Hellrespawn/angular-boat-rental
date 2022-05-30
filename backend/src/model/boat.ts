import { BoatModel, BoatType } from 'src/database/boat.dao';
import { RentalModel } from 'src/database/rental.dao';

export class Boat {
  constructor(
    public name: string,
    public registrationNumber: number,
    public pricePerDay: number,
    public skipperRequired: boolean,
    public maintenance: boolean,
    public imageRoute: string,
    public lengthInM: number,
    public maxOccupants: number,
    public boatType: BoatType,
    public rentals: RentalModel[],
    public maxSpeedInKmH?: number,
    public sailAreaInM2?: number,
    public id?: number
  ) {}
  public static fromModel(boatModel: BoatModel): Boat {
    return new Boat(
      boatModel.name,
      boatModel.registrationNumber,
      boatModel.pricePerDay,
      boatModel.skipperRequired,
      boatModel.maintenance,
      boatModel.imageRoute,
      boatModel.lengthInM,
      boatModel.maxOccupants,
      boatModel.boatType,
      boatModel.rentals,
      boatModel.maxSpeedInKmH,
      boatModel.sailAreaInM2,
      boatModel.id
    );
  }
}
