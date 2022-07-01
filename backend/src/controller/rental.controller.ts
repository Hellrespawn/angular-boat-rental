import { type JSONSchemaType } from 'ajv';
import { RentalConfirmation, type NewRentalData } from 'auas-common';
import { type Request, type Response } from 'express';
import { RentalService } from '../services/rental.service';
import { ServerError } from '../util/error';

/**
 * JSON Schema describing NewRentalData
 */
export const NEW_RENTAL_SCHEMA: JSONSchemaType<NewRentalData> = {
  type: 'object',
  properties: {
    boatRegistrationNumber: {
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
  required: ['boatRegistrationNumber', 'dateStart', 'dateEnd'],
  additionalProperties: false,
};

export class RentalController {
  private static instance?: RentalController;

  private constructor(private rentalService = RentalService.getInstance()) {}

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
    const boatRegistrationNumber = parseInt(
      req.body.boatRegistrationNumber as string
    );
    const dateStart = new Date(req.body.dateStart as string);
    const dateEnd = new Date(req.body.dateEnd as string);

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const { id: userId } = req.currentUser!;

    try {
      const orderNumber = await this.rentalService.addRental(
        boatRegistrationNumber,
        userId,
        dateStart,
        dateEnd
      );

      const confirmation: RentalConfirmation = { orderNumber };

      res.json(confirmation);
    } catch (error) {
      ServerError.respond(error, res);
    }
  }
}
