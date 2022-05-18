import { JSONSchemaType } from 'ajv';
import { Request, Response } from 'express';
import { RentalService } from '../services/rental.service';
import { ServerError } from '../util/error';

/**
 * Interface matching the expected data for a new rental.
 */
type NewRentalData = {
  boatId: number;
  userId: number;
  dateStart: string;
  dateEnd: string;
};

/**
 * JSON Schema describing NewRentalData
 */
export const NEW_RENTAL_SCHEMA: JSONSchemaType<NewRentalData> = {
  type: 'object',
  properties: {
    boatId: {
      type: 'number',
    },
    userId: {
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
  required: ['boatId', 'userId', 'dateStart', 'dateEnd'],
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
    const userId: number = req.body.userId;
    const dateStart = new Date(req.body.dateStart);
    const dateEnd = new Date(req.body.dateEnd);

    try {
      const rental = await this.rentalService.addRental(
        boatId,
        userId,
        dateStart,
        dateEnd
      );
      res.json({ id: rental.id });
    } catch (error) {
      ServerError.respond(error, res);
    }
  }
}
