import { SkipperService } from '../services/skipper.service';
import { Skipper } from '../model/skipper.model';
import express from 'express';

export class SkipperController {
  constructor(private skipperService: SkipperService = new SkipperService()) {}

  public async getSkippers(
    req: express.Request,
    res: express.Response
  ): Promise<void> {
    try {
      const result: Skipper[] = await this.skipperService.returnAllSkippers();
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
    const pricePerDay: number = req.body.pricePerDay;
    const birthDate: Date = req.body.birthDate;
    this.skipperService.addSkipper(res, name, pricePerDay, birthDate);
  }

  public async deleteSkipper(
    req: express.Request,
    res: express.Response
  ): Promise<void> {
    const idOfSkipper: number = +req.params.id;
    this.skipperService.deleteSkipper(res, idOfSkipper);
  }

  public async updateSkipper(
    req: express.Request,
    res: express.Response
  ): Promise<void> {
    const idOfSkipper: number = +req.body.id;
    const updatedValue: boolean = req.body.updatedValue;
    try {
      this.skipperService.updateSkipper(res, idOfSkipper, updatedValue);
    } catch (error) {
      res.status(400).send(error);
    }
  }
}
