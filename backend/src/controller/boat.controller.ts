import { BoatService } from '../services/boat.service';
import { Boat } from '../model/boat.model';
import { Request, Response } from 'express';

export class BoatController {
  // YYYY-MM-DD
  public static dateRegex = /\d{4}-\d{2}-\d{2}/;

  constructor(private boatService: BoatService = new BoatService()) {}

  private getAndValidateDate(dateString: string): Date {
    if (!dateString.match(BoatController.dateRegex)) {
      throw `Invalid date: "${dateString}", required format is YYYY-MM-DD`;
    }

    return new Date(dateString);
  }

  private getAndValidateDates(req: Request): [Date, Date] {
    return [
      this.getAndValidateDate(req.params.dateStart),
      this.getAndValidateDate(req.params.dateEnd),
    ];
  }

  public async getBoats(req: Request, res: Response): Promise<void> {
    try {
      const boats: Boat[] = await this.boatService.returnAllBoats();
      res.status(200).json({ boats });
    } catch (error) {
      console.error(error);
      res.status(500).send(error);
    }
  }

  public async getBoatDetailData(req: Request, res: Response): Promise<void> {
    try {
      // ID is checked by middleware in route.
      const id = +req.params.id;
      const boat = await this.boatService.getBoatDetailData(id);
      res.status(200).json({ boat });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error });
    }
  }

  public async getBoatOverviewData(req: Request, res: Response): Promise<void> {
    try {
      const boats = await this.boatService.getBoatsOverviewData();
      res.status(200).json({ boats });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error });
    }
  }

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

  public async getBookedDates(req: Request, res: Response): Promise<void> {
    // Validated by middleware
    const id = parseInt(req.params.id);
    try {
      res.json({ dates: await this.boatService.getBookedDates(id) });
    } catch (error) {
      res.status(400).json({ error });
    }
  }

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
  public async deleteBoat(req: Request, res: Response): Promise<void> {
    const idOfBoat: number = +req.params.id;
    try {
      const result = await this.boatService.deleteBoat(idOfBoat);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).send(error);
    }
  }

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
