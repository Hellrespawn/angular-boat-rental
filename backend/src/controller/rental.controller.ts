import { JSONSchemaType } from 'ajv';
import { Request, Response } from 'express';
import { RentalService } from '../services/rental.service';
import { ServerError } from '../util/error';

/**
 * Interface matching the expected data for a new rental.
 */
type NewRentalData = {
  boatId: number;
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
    dateStart: {
      type: 'string',
      format: 'date-time',
    },
    dateEnd: {
      type: 'string',
      format: 'date-time',
    },
  },
  required: ['boatId', 'dateStart', 'dateEnd'],
  additionalProperties: false,
};

export class RentalController {
  private static instance: RentalController;

  private constructor(private rentalService = new RentalService()) {}

  public static getInstance(): RentalController {
    if (!this.instance) {
      this.instance = new RentalController();
    }

    return this.instance;
  }

  /**
   * Adds a new rental to the database.
   *
   * @param req
   * @param res
   */
  public async addRental(req: Request, res: Response): Promise<void> {
    // Validated by middleware in routes.
    const boatId: number = req.body.boatId;
    const dateStart = new Date(req.body.dateStart);
    const dateEnd = new Date(req.body.dateEnd);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const userId: number = req.currentUser!.id;

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
