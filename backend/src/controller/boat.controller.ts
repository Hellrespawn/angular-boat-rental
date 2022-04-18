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

  public async isBoatAvailable(req: Request, res: Response): Promise<void> {
    try {
      // Validated by middleware
      const id = parseInt(req.params.id);
      const [dateStart, dateEnd] = this.getAndValidateDates(req);

      const available = await this.boatService.isBoatAvailable(
        id,
        new Date(dateStart),
        new Date(dateEnd)
      );

      res.json({ available });
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
      const result = await Boat.create({
        name,
        registrationNumber,
        pricePerDay,
        skipperRequired,
        maintenance: false,
        imageRoute,
        lengthInM,
        maxOccupants,
        boatType,
        maxSpeedInKmH,
        sailAreaInM2,
      });
      res.status(200).json(result);
    } catch (error) {
      res.status(400).send(error);
    }
  }
  public async deleteBoat(req: Request, res: Response): Promise<void> {
    const idOfBoat: number = +req.params.id;
    const boatToDelete: Boat | null = await Boat.findByPk(idOfBoat);
    if (boatToDelete !== null) {
      try {
        await boatToDelete.destroy();
        res.status(200).json({ result: 'Boat deleted' });
      } catch (error) {
        res.status(400).send(error);
      }
    } else {
      res.status(400).json({ result: 'Boat not found' });
    }
  }

  public async updateBoat(req: Request, res: Response): Promise<void> {
    const idOfBoat: number = +req.body.id;
    const updatedValue: boolean = req.body.updatedValue;
    try {
      const boatToUpdate: Boat | null = await Boat.findByPk(idOfBoat);
      if (boatToUpdate !== null) {
        boatToUpdate.maintenance = updatedValue;
        await boatToUpdate.save();
        res.status(200).json({ result: 'Boat Updated' });
      } else {
        res.status(400).json({ result: 'Boat not found' });
      }
    } catch (error) {
      res.status(400).send(error);
    }
  }
}
