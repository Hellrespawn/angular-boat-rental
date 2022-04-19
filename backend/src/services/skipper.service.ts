import { Skipper } from '../model/skipper.model';
import express from 'express';
export class SkipperService {
  private skipperArray: Array<Skipper> = [];

  private async updateSkippers(): Promise<void> {
    this.skipperArray = await Skipper.findAll();
  }

  public async returnAllSkippers(): Promise<Array<Skipper>> {
    await this.updateSkippers();
    return this.skipperArray;
  }

  public async updateSkipper(
    res: express.Response,
    idOfSkipper: number,
    updatedValue: boolean
  ): Promise<void> {
    const skipperToUpdate: Skipper | null = await Skipper.findByPk(idOfSkipper);
    if (skipperToUpdate !== null) {
      skipperToUpdate.leave = updatedValue;
      await skipperToUpdate.save();
      res.status(200).json({ result: 'Boat Updated' });
    } else {
      res.status(400).json({ result: 'Boat not found' });
    }
  }

  public async deleteSkipper(
    res: express.Response,
    idOfSkipper: number
  ): Promise<void> {
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

  public async addSkipper(
    res: express.Response,
    name: string,
    pricePerDay: number,
    birthDate: Date
  ): Promise<void> {
    try {
      const result = await Skipper.create({ name, pricePerDay, birthDate });
      res.status(200).json(result);
    } catch (error) {
      res.status(400).send(error);
    }
  }
}
