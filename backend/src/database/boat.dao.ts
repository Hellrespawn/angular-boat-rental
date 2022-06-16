import {
  Table,
  Column,
  Model,
  DataType,
  AllowNull,
  Unique,
  HasMany,
} from 'sequelize-typescript';
import { Boat, MotorBoat, SailBoat } from '../model/boat';
import { RentalModel } from './rental.dao';

export type BoatType = 'sail' | 'motor';

export type BoatRequirements = 'none' | 'license' | 'skipper';

// Not familiar with a way to construct this from the above type.
const BOAT_TYPES = ['sail', 'motor'];

export class BoatDao {
  public async getBoats(): Promise<Boat[]> {
    const models = await BoatModel.findAll();

    return models.map((model: BoatModel) => model.toBoat());
  }

  public async getById(id: number): Promise<Boat | null> {
    const boatModel = await BoatModel.findOne({
      where: { id },
      include: [RentalModel],
    });

    if (boatModel) {
      return boatModel.toBoat();
    }

    return null;
  }

  public async getByRentalId(rentalId: number): Promise<Boat | null> {
    const boatModel = await BoatModel.findOne({
      where: { rentalId },
    });

    if (boatModel) {
      return boatModel.toBoat();
    }

    return null;
  }

  public async saveNewBoat(newBoat: Boat): Promise<void> {
    await BoatModel.create({
      name: newBoat.name,
      registrationNumber: newBoat.registrationNumber,
      pricePerDay: newBoat.pricePerDay,
      skipperRequired: newBoat.skipperRequired,
      maintenance: newBoat.maintenance,
      imageRoute: newBoat.imageRoute,
      lengthInM: newBoat.lengthInM,
      maxOccupants: newBoat.maxOccupants,
      boatType: newBoat.boatType,
      ...newBoat.getBoatData(),
    });
  }

  public async updateMaintenanceValueInBoat(
    idOfBoat: number,
    updatedValue: boolean
  ): Promise<void> {
    const boatToUpdate: BoatModel | null = await BoatModel.findByPk(idOfBoat);
    if (boatToUpdate !== null) {
      boatToUpdate.maintenance = updatedValue;
      await boatToUpdate.save();
    } else {
      throw 'Boat not found';
    }
  }

  public async deleteBoat(idOfBoat: number): Promise<void> {
    const boatToDelete: BoatModel | null = await BoatModel.findByPk(idOfBoat);
    if (boatToDelete !== null) {
      await boatToDelete.destroy();
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

  public toBoat(): Boat {
    if (this.boatType === 'motor') {
      return new MotorBoat(
        this.id,
        this.name,
        this.registrationNumber,
        this.pricePerDay,
        this.skipperRequired,
        this.maintenance,
        this.imageRoute,
        this.lengthInM,
        this.maxOccupants,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        this.maxSpeedInKmH!
      );
    } else {
      return new SailBoat(
        this.id,
        this.name,
        this.registrationNumber,
        this.pricePerDay,
        this.skipperRequired,
        this.maintenance,
        this.imageRoute,
        this.lengthInM,
        this.maxOccupants,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        this.sailAreaInM2!
      );
    }
  }
}
