import { BoatService } from '../services/boat.service';
import { type Request, type Response } from 'express';
import { ServerError } from '../util/error';
import { type JSONSchemaType } from 'ajv';
import { type NewBoatRequest } from 'auas-common';

export const NEW_BOAT_SCHEMA: JSONSchemaType<NewBoatRequest> = {
  type: 'object',
  properties: {
    registrationNumber: {
      type: 'number',
    },
    pricePerDay: {
      type: 'number',
    },
    imageRoute: {
      type: 'string',
    },
    lengthInM: {
      type: 'number',
    },
    maxPassengers: {
      type: 'number',
    },
    boatType: {
      type: 'string',
    },
    sailAreaInM2: {
      type: 'number',
      nullable: true,
    },
    maxSpeedInKmH: {
      type: 'number',
      nullable: true,
    },
    name: {
      type: 'string',
      nullable: true,
    },
  },
  required: [
    'pricePerDay',
    'registrationNumber',
    'imageRoute',
    'lengthInM',
    'maxPassengers',
    'boatType',
  ],
  additionalProperties: true, //needs to accept either maxSpeed or sailInSquareMeter
};

export class BoatController {
  private static instance?: BoatController;

  // YYYY-MM-DD
  private static dateRegex = /^\d{4}-\d{2}-\d{2}$/;

  private constructor(private boatService = BoatService.getInstance()) {}

  public static getInstance(): BoatController {
    if (!this.instance) {
      this.instance = new BoatController();
    }

    return this.instance;
  }

  /**
   * Responds with an array of all boats as BoatOverviewData.
   * @param req
   * @param res
   */
  public async getBoatsOverviewData(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const boats = await this.boatService.getBoatsOverviewData();
      res.status(200).json({ boats });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error });
    }
  }

  /**
   * Responds with an array of all boats  that are available on the specified
   * dates as BoatOverviewData.
   * @param req
   * @param res
   */
  public async getAvailableBoatsOverviewData(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const [dateStart, dateEnd] = this.getAndValidateDates(req);

      const boats = await this.boatService.getAvailableBoatsOverviewData(
        new Date(dateStart),
        new Date(dateEnd)
      );

      res.json({ boats });
    } catch (error) {
      ServerError.respond(error, res);
    }
  }

  /**
   * Responds with detailed data of boat with id req.params.id
   * @param req
   * @param res
   */
  public async getBoatDetailData(req: Request, res: Response): Promise<void> {
    try {
      // ID is checked by middleware in route.
      const id = parseInt(req.params.id);
      const boat = await this.boatService.getBoatDetailData(id);
      if (boat) {
        res.status(200).json({ boat });
      } else {
        res.status(404).json({ error: `Boat with id ${id} not found!` });
      }
    } catch (error) {
      ServerError.respond(error, res);
    }
  }

  /**
   * Returns an array with all dates on which the specified boat is booked.
   *
   * @param req
   * @param res
   */
  public async getBookedDates(req: Request, res: Response): Promise<void> {
    // Validated by middleware
    const id = parseInt(req.params.id);
    try {
      res.json({ dates: await this.boatService.getBookedDates(id) });
    } catch (error) {
      res.status(400).json({ error });
    }
  }

  public async save(req: Request, res: Response): Promise<void> {
    try {
      if (!req.file) {
        throw new ServerError('No image file included!');
      }

      const {
        registrationNumber,
        pricePerDay,
        imageRoute,
        lengthInM,
        maxPassengers,
        boatType,
        name,
        sailAreaInM2,
        maxSpeedInKmH,
      } = req.body as NewBoatRequest; // Validated by middleware

      await this.boatService.save(
        registrationNumber,
        pricePerDay,
        imageRoute,
        lengthInM,
        maxPassengers,
        boatType,
        req.file,
        name,
        maxSpeedInKmH,
        sailAreaInM2
      );

      res.status(200).end();
    } catch (error) {
      ServerError.respond(error, res);
    }
  }

  public async delete(req: Request, res: Response): Promise<void> {
    const id = parseInt(req.params.id);

    try {
      await this.boatService.delete(id);

      res.status(200).end();
    } catch (error) {
      ServerError.respond(error, res);
    }
  }

  /**
   * Check that dateString matches dateRegex and return it as a Date object.
   *
   * @param dateString
   * @returns dateString as a date.
   */
  private getAndValidateDate(dateString: string): Date {
    if (!dateString.match(BoatController.dateRegex)) {
      throw new ServerError(
        `Invalid date: "${dateString}", required format is YYYY-MM-DD`
      );
    }

    return new Date(dateString);
  }

  /**
   * Checks that req.params.dateStart and req.params.dateEnd match dateRegex,
   * and returns them as Date objects.
   *
   * @param req the request containing the dates
   * @returns the dates as Date objects.
   */
  private getAndValidateDates(req: Request): [Date, Date] {
    return [
      this.getAndValidateDate(req.params.dateStart),
      this.getAndValidateDate(req.params.dateEnd),
    ];
  }
}
