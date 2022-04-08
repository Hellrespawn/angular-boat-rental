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
      const result = await this.boatService.returnAllBoats();
      res.status(200).json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Something went wrong!' });
    }
  }

  public async addBoat(
    req: express.Request,
    res: express.Response
  ): Promise<void> {
    const name: string = req.body.name;
    const price: number = +req.body.price;
    const skipperNeeded: boolean = req.body.skipperNeeded;
    const photo: Blob | undefined | null = <Blob>req.body.photo;
    const length: number = +req.body.length;
    const maxSpeed: number = +req.body.maxSpeed;
    const sailOrMotor: 'sail' | 'motor' = req.body.sailOrMotor;
    try {
      const result = await Boat.create({
        name,
        price,
        skipperNeeded,
        photo,
        length,
        maxSpeed,
        sailOrMotor,
      });
      res.status(200).json(result);
    } catch (error: any) {
      res.status(400).send(makeArrayOfErrorMessages(error));
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
      } catch (error: any) {
        res.status(400).send(makeArrayOfErrorMessages(error));
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
    } catch (error: any) {
      res.status(400).send(makeArrayOfErrorMessages(error));
    }
  }
}

export function makeArrayOfErrorMessages(error: any): Array<string> {
  const errors = error.errors;
  const arrayOfErrorMessages = [];
  if (errors.length !== undefined) {
    for (const error of errors) {
      arrayOfErrorMessages.push(error.message);
    }
  }
  return arrayOfErrorMessages;
}
