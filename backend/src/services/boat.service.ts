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
  private boatArray: Array<Boat> = [];

  private async updateBoats(): Promise<void> {
    this.boatArray = await Boat.findAll();
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

  public async getBoatOverviewData(): Promise<BoatOverviewData[]> {
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
  public async deleteBoat(
    res: express.Response,
    idOfBoat: number
  ): Promise<void> {
    const boatToDelete: Boat | null = await Boat.findByPk(idOfBoat);
    if (boatToDelete !== null) {
      try {
        await boatToDelete.destroy();
        res.status(200).json({ result: 'Boat deleted' });
      } catch (error) {
        res.status(400).send(error);
      }
    } else {
      res.status(400).json({ result: 'Boat not found' });
    }
  }
  public async updateBoat(
    res: express.Response,
    idOfBoat: number,
    updatedValue: boolean
  ): Promise<void> {
    const boatToUpdate: Boat | null = await Boat.findByPk(idOfBoat);
    if (boatToUpdate !== null) {
      boatToUpdate.maintenance = updatedValue;
      await boatToUpdate.save();
      res.status(200).json({ result: 'Boat Updated' });
    } else {
      res.status(400).json({ result: 'Boat not found' });
    }
  }
}
