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
    try {
      const result = await Skipper.create({ name, pricePerDay, birthDate });
      res.status(200).json(result);
    } catch (error) {
      res.status(400).send(error);
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
      } catch (error) {
        res.status(400).send(error);
      }
    } else {
      res.status(400).json({ result: 'Skipper not found' });
    }
  }

  public async updateSkipper(
    req: express.Request,
    res: express.Response
  ): Promise<void> {
    const idOfSkipper: number = +req.body.id;
    const updatedValue: boolean = req.body.updatedValue;
    try {
      const skipperToUpdate: Skipper | null = await Skipper.findByPk(
        idOfSkipper
      );
      if (skipperToUpdate !== null) {
        skipperToUpdate.leave = updatedValue;
        await skipperToUpdate.save();
        res.status(200).json({ result: 'Boat Updated' });
      } else {
        res.status(400).json({ result: 'Boat not found' });
      }
    } catch (error) {
      res.status(400).send(error);
    }
  }
}
