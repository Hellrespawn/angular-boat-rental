import { JSONSchemaType } from 'ajv';
import { Request, Response } from 'express';
import { RentalService } from '../services/rental.service';

/**
 * Interface matching the expected data for a new rental.
 */
type NewRentalData = {
  boatId: number;
  customerId: number;
  dateStart: string;
  dateEnd: string;
};

/**
 * JSON Schema describing NewRentalData
 */
export const newRentalSchema: JSONSchemaType<NewRentalData> = {
  type: 'object',
  properties: {
    boatId: {
      type: 'number',
    },
    customerId: {
      type: 'number',
    },
    dateStart: {
      type: 'string',
      format: 'date-time',
    },
    dateEnd: {
      type: 'string',
      format: 'date-time',
    },
  },
  required: ['boatId', 'customerId', 'dateStart', 'dateEnd'],
  additionalProperties: false,
};

export class RentalController {
  constructor(private rentalService: RentalService = new RentalService()) {}

  /**
   * Adds a new rental to the database.
   *
   * @param req
   * @param res
   */
  public async addRental(req: Request, res: Response): Promise<void> {
    // Validated by middleware in routes.
    const boatId: number = req.body.boatId;
    const customerId: number = req.body.customerId;
    const dateStart = new Date(req.body.dateStart);
    const dateEnd = new Date(req.body.dateEnd);

    try {
      const rental = await this.rentalService.addRental(
        boatId,
        customerId,
        dateStart,
        dateEnd
      );
      res.json({ id: rental.id });
    } catch (error) {
      console.log(error);
      res.status(400).json({ error });
    }
  }
}
