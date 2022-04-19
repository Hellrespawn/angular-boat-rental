import { BoatService } from '../services/boat.service';
import { Boat } from '../model/boat.model';
import express from 'express';

export class BoatController {
  constructor(private boatService: BoatService = new BoatService()) {}

  public async getBoats(
    req: express.Request,
    res: express.Response
  ): Promise<void> {
    try {
      const boats: Boat[] = await this.boatService.returnAllBoats();
      res.status(200).json({ boats });
    } catch (error) {
      console.error(error);
      res.status(500).send(error);
    }
  }

  public async getBoatDetailData(
    req: express.Request,
    res: express.Response
  ): Promise<void> {
    try {
      // ID is checked by middleware in route.
      const id = +req.params.id;
      const boat = await this.boatService.getBoatDetailData(id);
      res.status(200).json({ boat });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error });
    }
  }

  public async getBoatOverviewData(
    req: express.Request,
    res: express.Response
  ): Promise<void> {
    try {
      const boats = await this.boatService.getBoatOverviewData();
      res.status(200).json({ boats });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error });
    }
  }

  public async addBoat(
    req: express.Request,
    res: express.Response
  ): Promise<void> {
    const name: string = req.body.name;
    const registrationNumber: number = req.body.registrationNumber;
    const pricePerDay: number = +req.body.pricePerDay;
    const skipperRequired: boolean = req.body.skipperRequired;
    const imageRoute: string = req.body.imageRoute;
    const lengthInM: number = +req.body.lengthInM;
    const maxOccupants: number = req.body.maxOccupants;
    const boatType: 'sail' | 'motor' = req.body.boatType;
    const maxSpeedInKmH: number = req.body.maxSpeedInKmH;
    const sailAreaInM2: number = req.body.sailAreaInM2;
    try {
      const result = await this.boatService.addBoat(
        name,
        registrationNumber,
        pricePerDay,
        skipperRequired,
        imageRoute,
        lengthInM,
        maxOccupants,
        boatType,
        maxSpeedInKmH,
        sailAreaInM2
      );
      res.status(200).json(result);
    } catch (error) {
      res.status(400).send(error);
    }
  }
  public async deleteBoat(
    req: express.Request,
    res: express.Response
  ): Promise<void> {
    const idOfBoat: number = +req.params.id;
    this.boatService.deleteBoat(res, idOfBoat);
  }

  public async updateBoat(
    req: express.Request,
    res: express.Response
  ): Promise<void> {
    const idOfBoat: number = +req.body.id;
    const updatedValue: boolean = req.body.updatedValue;
    try {
      this.boatService.updateBoat(res, idOfBoat, updatedValue);
    } catch (error) {
      res.status(400).send(error);
    }
  }
}
