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
      const result = await Boat.create({
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
    req: express.Request,
    res: express.Response
  ): Promise<void> {
    const idOfBoat: number = +req.body.id;
    const updatedValue: boolean = req.body.updatedValue;
    try {
      const boatToUpdate: Boat | null = await Boat.findByPk(idOfBoat);
      if (boatToUpdate !== null) {
        boatToUpdate.maintenance = updatedValue;
        await boatToUpdate.save();
        res.status(200).json({ result: 'Boat Updated' });
      } else {
        res.status(400).json({ result: 'Boat not found' });
      }
    } catch (error) {
      res.status(400).send(error);
    }
  }
}
