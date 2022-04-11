import { SkipperService } from '../services/skipper.service';
import { Skipper } from '../model/skipper.model';
import express from 'express';
import { makeArrayOfErrorMessages } from './boat.controller';

export class SkipperController {
  constructor(private skipperService: SkipperService = new SkipperService()) {}

  public async getSkippers(
    req: express.Request,
    res: express.Response
  ): Promise<void> {
    try {
      const result = await this.skipperService.returnAllSkippers();
      res.status(200).json(result);
    } catch {
      console.error();
      res.status(500).json('Something went wrong!');
    }
  }

  public async addSkipper(
    req: express.Request,
    res: express.Response
  ): Promise<void> {
    const name: string = req.body.name;
    const price: number = req.body.price;
    if (
      name &&
      price &&
      typeof name == 'string' &&
      typeof price == 'number' &&
      price > 0
    ) {
      try {
        const result = await Skipper.create({ name, price });
        res.status(200).json(result);
      } catch {
        console.error();
        res.status(400).json('This name is already in use');
      }
    } else {
      res.status(400).json('Invalid input');
    }
  }

  public async deleteSkipper(
    req: express.Request,
    res: express.Response
  ): Promise<void> {
    const idOfSkipper: number = +req.params.id;
    const skipperToDelete: Skipper | null = await Skipper.findByPk(idOfSkipper);
    if (skipperToDelete !== null) {
      try {
        await skipperToDelete.destroy();
        res.status(200).json({ result: 'Boat deleted' });
      } catch (error: any) {
        res.status(400).send(makeArrayOfErrorMessages(error));
      }
    } else {
      res.status(400).json({ result: 'Skipper not found' });
    }
  }
}
