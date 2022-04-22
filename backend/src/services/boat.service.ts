import { Boat, BoatRequirements, BoatType } from '../model/boat.model';
import express from 'express';

export type BoatOverviewData = {
  id: number;
  imageRoute: string;
  name: string;
  requirements: BoatRequirements;
  boatType: BoatType;
  maxOccupants: number;
};

export type BoatDetailData = {
  registrationNumber: number;
  pricePerDay: number;
  lengthInM: number;
  maxSpeedInKmH?: number;
  sailAreaInM2?: number;
};

export class BoatService {
  private boatArray: Boat[] = [];

  private async updateBoats(): Promise<void> {
    this.boatArray = await Boat.findAll();
  }

  private boatInstanceToOverviewData(boat: Boat): BoatOverviewData {
    return {
      id: boat.id,
      name: boat.name,
      imageRoute: boat.imageRoute,
      requirements: boat.getRequirements(),
      boatType: boat.boatType,
      maxOccupants: boat.maxOccupants,
    };
  }

  public async returnAllBoats(): Promise<Array<Boat>> {
    await this.updateBoats();
    return this.boatArray;
  }

  public async getBoatDetailData(
    id: number
  ): Promise<(BoatOverviewData & BoatDetailData) | null> {
    const boat = await Boat.findByPk(id);

    if (boat) {
      const overviewData = this.boatInstanceToOverviewData(boat);

      const detailData: BoatDetailData = {
        registrationNumber: boat.registrationNumber,
        pricePerDay: boat.pricePerDay,
        lengthInM: boat.lengthInM,
        // These constraints are enforced at object creation.
        maxSpeedInKmH: boat.maxSpeedInKmH,
        sailAreaInM2: boat.sailAreaInM2,
      };

      return { ...overviewData, ...detailData };
    } else {
      return null;
    }
  }

  public async getBoatsOverviewData(): Promise<BoatOverviewData[]> {
    const boats = await this.returnAllBoats();

    return boats.map(this.boatInstanceToOverviewData);
  }

  public async addBoat(
    name: string,
    registrationNumber: number,
    pricePerDay: number,
    skipperRequired: boolean,
    imageRoute: string,
    lengthInM: number,
    maxOccupants: number,
    boatType: string,
    maxSpeedInKmH: number,
    sailAreaInM2: number
  ): Promise<Boat> {
    return await Boat.create({
      name,
      registrationNumber,
      pricePerDay,
      skipperRequired,
      maintenance: false,
      imageRoute,
      lengthInM,
      maxOccupants,
      boatType,
      maxSpeedInKmH,
      sailAreaInM2,
    });
  }
  public async deleteBoat(idOfBoat: number): Promise<void> {
    const boatToDelete: Boat | null = await Boat.findByPk(idOfBoat);
    if (boatToDelete !== null) {
      await boatToDelete.destroy();
    } else {
      throw 'Boat not found';
    }
  }
  public async updateBoat(
    idOfBoat: number,
    updatedValue: boolean
  ): Promise<void> {
    const boatToUpdate: Boat | null = await Boat.findByPk(idOfBoat);
    if (boatToUpdate !== null) {
      boatToUpdate.maintenance = updatedValue;
      await boatToUpdate.save();
    } else {
      throw 'Boat not found';
    }
  }
  public async isBoatAvailable(
    id: number,
    dateStart: Date,
    dateEnd: Date
  ): Promise<boolean> {
    const boat = await Boat.findByPk(id);

    if (!boat) {
      throw `Boat with id ${id} doesn't exist!`;
    }

    return boat.isAvailable(dateStart, dateEnd);
  }

  public async getAvailableBoatsOverviewData(
    dateStart: Date,
    dateEnd: Date
  ): Promise<BoatOverviewData[]> {
    const boats = await Boat.findAll();

    // Can't use async function with filter, get and await availability first.
    const availability = await Promise.all(
      boats.map((boat) => boat.isAvailable(dateStart, dateEnd))
    );

    // Then filter with indices.
    const filteredBoats = boats.filter((_, index) => {
      return availability[index];
    });

    return filteredBoats.map(this.boatInstanceToOverviewData);
  }
}
