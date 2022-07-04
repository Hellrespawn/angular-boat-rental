import { Boat } from '../model/boat';
import { BoatDao } from '../persistence/boat.dao';
import { ServerError } from '../util/error';
import {
  type BoatDetailData,
  type BoatOverviewData,
  type BoatType,
} from 'auas-common';
import { ImageService } from './image.service';

export class BoatService {
  private static instance?: BoatService;

  private constructor(
    private boatDao = BoatDao.getInstance(),
    private imageService = ImageService.getInstance()
  ) {
    // Intentionally left blank
  }

  public static getInstance(): BoatService {
    if (!this.instance) {
      this.instance = new BoatService();
    }

    return this.instance;
  }

  /**
   * Get Boat by id
   */
  public getByRegistrationNumber(
    registrationNumber: number
  ): Promise<Boat | null> {
    return this.boatDao.getByRegistrationNumber(registrationNumber);
  }

  /**
   * requests all Boats from the database via the DAO
   * @returns all boats from the database
   */
  public getAll(): Promise<Boat[]> {
    return this.boatDao.getAll();
  }

  /**
   * Gets BoatDetailData for boat.
   *
   * @param registrationNumber the id of the desired boat
   * @returns A type intersection of BoatOverviewData and BoatDetailData
   */
  public async getBoatDetailData(
    registrationNumber: number
  ): Promise<BoatDetailData | null> {
    const boat = await this.getByRegistrationNumber(registrationNumber);

    if (boat) {
      const overviewData = this.boatInstanceToOverviewData(boat);

      const detailData: BoatDetailData = {
        ...overviewData,
        registrationNumber: boat.registrationNumber,
        pricePerDay: boat.pricePerDay,
        lengthInM: boat.lengthInM,
        ...boat.getBoatData(),
      };

      return detailData;
    }

    return null;
  }

  /**
   * Get all boats as BoatOverviewData.
   *
   * @returns an array of BoatOverviewData
   */
  public async getBoatsOverviewData(): Promise<BoatOverviewData[]> {
    const boats = await this.getAll();

    return boats.map((boat) => this.boatInstanceToOverviewData(boat));
  }

  /**
   * Get BoatOverviewData for all boats available between dateStart and dateEnd.
   *
   * @param dateStart start of period to check
   * @param dateEnd end of period to check
   * @returns an array of BoatOverviewData of boats available between
   * those dates.
   */
  public async getAvailableBoatsOverviewData(
    dateStart: Date,
    dateEnd: Date
  ): Promise<BoatOverviewData[]> {
    const boats = await this.getAll();

    // Can't use async function with filter, get and await availability first.
    const availability = await Promise.all(
      boats.map((boat) => boat.isAvailable(dateStart, dateEnd))
    );

    // Then filter with indices.
    const filteredBoats = boats.filter((_, index) => {
      return availability[index];
    });

    return filteredBoats.map((boat) => this.boatInstanceToOverviewData(boat));
  }

  public async save(
    registrationNumber: number,
    pricePerDay: number,
    imageRoute: string,
    lengthInM: number,
    maxPassengers: number,
    boatType: BoatType,
    file: Express.Multer.File,
    name?: string,
    maxSpeedInKmH?: number,
    sailAreaInM2?: number
  ): Promise<void> {
    if (await this.imageService.exists(file.originalname)) {
      throw new ServerError('Image already exists.');
    }

    await this.boatDao.save(
      await Boat.createBoat(
        registrationNumber,
        pricePerDay,
        imageRoute,
        lengthInM,
        maxPassengers,
        boatType,
        name,
        maxSpeedInKmH,
        sailAreaInM2
      )
    );

    await this.imageService.save(file.buffer, file.originalname);
  }

  public async delete(registrationNumber: number): Promise<void> {
    if (!(await this.boatDao.delete(registrationNumber))) {
      throw new ServerError(
        `Unable to delete boat with registrationNumber ${registrationNumber}`
      );
    }
  }

  /**
   * Get all Dates for which boat with id is booked.
   *
   * @param registrationNumber the id of the desired boat.
   *
   * @returns an array of Dates
   */
  public async getBookedDates(registrationNumber: number): Promise<Date[]> {
    const boat = await this.getByRegistrationNumber(registrationNumber);

    if (!boat) {
      throw new ServerError(
        `Boat with registration number ${registrationNumber} doesn't exist.`
      );
    }

    return boat.getBookedDates();
  }

  /**
   * Converts a Boat into BoatOverviewData.
   *
   * @param boat the boat to convert
   * @returns the converted boat
   */
  private boatInstanceToOverviewData(boat: Boat): BoatOverviewData {
    return {
      registrationNumber: boat.registrationNumber,
      imageRoute: boat.imageRoute,
      requirements: boat.getRequirements(),
      maxPassengers: boat.maxPassengers,
      boatType: boat.boatType,
      name: boat.name,
      ...boat.getBoatData(),
    };
  }
}
