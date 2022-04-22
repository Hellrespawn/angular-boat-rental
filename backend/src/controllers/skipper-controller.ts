import { SkipperService } from '../services/skipper-service';
import { Skipper } from '../models/Skipper';
import express from 'express';

export class SkipperController {
  constructor(private skipperService: SkipperService = new SkipperService()) {}
  public async getSkippers(
    req: express.Request,
    res: express.Response
  ): Promise<void> {
    try {
      let result = await this.skipperService.returnAllSkippers();
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
}
