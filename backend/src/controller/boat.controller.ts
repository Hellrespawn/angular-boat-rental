import { BoatService } from '../services/boat.service';
import { Boat } from '../model/boat.model';
import { Request, Response } from 'express';

export class BoatController {
  // YYYY-MM-DD
  public static dateRegex = /\d{4}-\d{2}-\d{2}/;

  constructor(private boatService: BoatService = new BoatService()) {}

  /**
   * Check that dateString matches dateRegex and return it as a Date object.
   *
   * @param dateString
   * @returns dateString as a date.
   */
  private getAndValidateDate(dateString: string): Date {
    if (!dateString.match(BoatController.dateRegex)) {
      throw `Invalid date: "${dateString}", required format is YYYY-MM-DD`;
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

  /**
   * gets all boats from database through the boat service
   * @param req the request made to the backend
   * @param res the response sent back to the client
   */
  public async getBoats(req: Request, res: Response): Promise<void> {
    try {
      const boats: Boat[] = await this.boatService.returnAllBoats();
      res.status(200).json({ boats });
    } catch (error) {
      console.error(error);
      res.status(500).send(error);
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
      const id = +req.params.id;
      const boat = await this.boatService.getBoatDetailData(id);
      if (boat) {
        res.status(200).json({ boat });
      } else {
        res.status(404).json({ error: `Boat with id ${id} not found!` });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error });
    }
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
      res.status(400).json({ error });
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

  /**
   * adds a new boat to the database through the service
   * @param req the request made to the backend
   * @param res the response sent back to the client
   */
  public async addBoat(req: Request, res: Response): Promise<void> {
    const name: string = req.body.name;
    const registrationNumber: number = req.body.registrationNumber;
    const pricePerDay: number = +req.body.pricePerDay;
    const skipperRequired: boolean = req.body.skipperRequired;
    const imageRoute: string = req.body.imageRoute;
    const lengthInM: number = +req.body.lengthInM;
    const maxOccupants: number = req.body.maxOccupants;
    const boatType: 'sail' | 'motor' = req.body.boatType;
    const maxSpeedInKmH: number = req.body.maxSpeedInKmH;
    const sailAreaInM2: number = req.body.sailAreaInM2;
    try {
      const result = await this.boatService.addBoat(
        name,
        registrationNumber,
        pricePerDay,
        skipperRequired,
        imageRoute,
        lengthInM,
        maxOccupants,
        boatType,
        maxSpeedInKmH,
        sailAreaInM2
      );
      res.status(200).json(result);
    } catch (error) {
      res.status(400).send(error);
    }
  }
  /**
   * deletes a boat by id from the database through the service
   * @param req the request made to the backend
   * @param res the response sent back to the client
   */
  public async deleteBoat(req: Request, res: Response): Promise<void> {
    const idOfBoat: number = +req.params.id;
    try {
      const result = await this.boatService.deleteBoat(idOfBoat);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).send(error);
    }
  }

  /**
   * updates the maintenance boolean of a specific boat by id through the service
   * @param req the request made to the backend
   * @param res the response sent back to the client
   */
  public async updateBoat(req: Request, res: Response): Promise<void> {
    const idOfBoat: number = +req.body.id;
    const updatedValue: boolean = req.body.updatedValue;
    try {
      const result = await this.boatService.updateBoat(idOfBoat, updatedValue);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).send(error);
    }
  }
}
