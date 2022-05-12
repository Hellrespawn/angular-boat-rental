import { FineService } from '../services/fine.service';
import { Fine } from '../model/fine.model';
import express from 'express';

export class FineController {
  constructor(private fineService: FineService = new FineService()) {}

  /**gets all Fines from the database through the service
   * @param res the response sent back to the client
   */
  public async getFines(res: express.Response): Promise<void> {
    try {
      const result: Fine[] = await this.fineService.returnAllFines();
      res.status(200).json(result);
    } catch {
      console.error();
      res.status(500).json('Something went wrong!');
    }
  }

  /**
   * adds a Fine to the database through the service
   * @param req the request made to the backend
   * @param res the response sent back to the client
   */
  public async addFine(
    req: express.Request,
    res: express.Response
  ): Promise<void> {
    const userID: number = req.body.userID;
    const amount: number = req.body.amount;
    const paid: boolean = req.body.paid;
    try {
      const result = await this.fineService.addFine(userID, amount, paid);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json(error);
    }
  }
}
