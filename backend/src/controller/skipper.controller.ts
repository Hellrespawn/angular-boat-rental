import { SkipperService } from '../services/skipper.service';
import express from 'express';
import { Skipper } from '../model/skipper';
import { JSONSchemaType } from 'ajv';

/**
 * Interface matching the expected data for a new skipper.
 */
type NewSkipperData = {
  name: string;
  pricePerDay: number;
  birthDate: string;
};

/**
 * JSON Schema describing NewSkipperData
 */
export const NEW_SKIPPER_SCHEMA: JSONSchemaType<NewSkipperData> = {
  type: 'object',
  properties: {
    pricePerDay: {
      type: 'number',
    },
    birthDate: {
      type: 'string',
      format: 'date-time',
    },
    name: {
      type: 'string',
    },
  },
  required: ['name', 'pricePerDay', 'birthDate'],
  additionalProperties: false,
};

export class SkipperController {
  constructor(private skipperService: SkipperService = new SkipperService()) {}

  /**gets all Skippers from the database through the service
   * @param res the response sent back to the client
   */
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

  /**
   * adds a Skipper to the database through the service
   * @param req the request made to the backend
   * @param res the response sent back to the client
   */
  public async addSkipper(
    req: express.Request,
    res: express.Response
  ): Promise<void> {
    const name: string = req.body.name;
    const pricePerDay: number = req.body.pricePerDay;
    const birthDate: Date = new Date(req.body.birthDate);
    try {
      const result = await this.skipperService.addSkipper(
        name,
        pricePerDay,
        birthDate,
        false
      );
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json(error);
    }
  }

  /**
   * deletes a specific Skipper from the database by id through the service
   * @param req the request made to the backend
   * @param res the response sent back to the client
   */
  public async deleteSkipper(
    req: express.Request,
    res: express.Response
  ): Promise<void> {
    const idOfSkipper: number = +req.params.id;
    try {
      const result = await this.skipperService.deleteSkipper(idOfSkipper);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json(error);
    }
  }

  /**
   * updates the leave boolean of a specific skipper by id through the service
   * @param req the request made to the backend
   * @param res the response sent back to the client
   */
  public async updateLeaveOfSkipper(
    req: express.Request,
    res: express.Response
  ): Promise<void> {
    const idOfSkipper: number = +req.body.id;
    const updatedValue: boolean = req.body.updatedValue;
    try {
      const result = await this.skipperService.updateLeaveOfSkipper(
        idOfSkipper,
        updatedValue
      );
      res.status(200).json(result);
    } catch (error) {
      res.status(400).send(error);
    }
  }
}
