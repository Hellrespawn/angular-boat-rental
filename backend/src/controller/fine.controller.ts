import { FineService } from '../services/fine.service';
import express from 'express';
import { Fine } from '../model/fine';
import { JSONSchemaType } from 'ajv';

/**
 * Interface matching the expected data for a new fine.
 */
type NewFineData = {
  userId: number;
  amount: number;
  paid: boolean;
};

/**
 * JSON Schema describing NewFineData
 */
export const NEW_FINE_SCHEMA: JSONSchemaType<NewFineData> = {
  type: 'object',
  properties: {
    userId: {
      type: 'number',
    },
    amount: {
      type: 'number',
    },
    paid: {
      type: 'boolean',
    },
  },
  required: ['userId', 'amount', 'paid'],
  additionalProperties: false,
};
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
    const userId: number = req.body.userId;
    const amount: number = req.body.amount;
    const paid: boolean = req.body.paid;
    try {
      const result = await this.fineService.addFine(userId, amount, paid);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json(error);
    }
  }
}
