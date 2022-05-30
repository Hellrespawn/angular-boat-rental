import { Boat } from '../model/boat';
import {
  BoatDao,
  BoatModel,
  BoatRequirements,
  BoatType,
} from '../database/boat.dao';
import { ServerError } from '../util/error';

/**
 * type which is required by the boat rental overview page
 */
export type BoatOverviewData = {
  id: number;
  imageRoute: string;
  name: string;
  requirements: BoatRequirements;
  boatType: BoatType;
  maxOccupants: number;
};
/**
 * type which contains additional information about the boat
 */
export type BoatDetailData = BoatOverviewData & {
  registrationNumber: number;
  pricePerDay: number;
  lengthInM: number;
  maxSpeedInKmH?: number;
  sailAreaInM2?: number;
};

export class BoatService {
  private boatDao: BoatDao = new BoatDao();

  /**
   * Converts a Boat into BoatOverviewData.
   *
   * @param boat the boat to convert
   * @returns the converted boat
   */
  private boatInstanceToOverviewData(boat: Boat): BoatOverviewData {
    return {
      id: boat.id!,
      name: boat.name,
      imageRoute: boat.imageRoute,
      requirements: boat.getRequirements(),
      boatType: boat.boatType,
      maxOccupants: boat.maxOccupants,
    };
  }

  /**
   * requests all Boats from the database
   * @returns all boats from the database
   */
  public async returnAllBoats(): Promise<Array<Boat>> {
    return this.boatDao.getBoats();
  }

  /**
   * Gets BoatDetailData for boat.
   *
   * @param id the id of the desired boat
   * @returns A type intersection of BoatOverviewData and BoatDetailData
   */
  public async getBoatDetailData(id: number): Promise<BoatDetailData | null> {
    const boat = await BoatModel.findByPk(id);

    if (boat) {
      const boatModel = Boat.fromModel(boat);
      const overviewData = this.boatInstanceToOverviewData(boatModel);

      const detailData: BoatDetailData = {
        ...overviewData,
        registrationNumber: boat.registrationNumber,
        pricePerDay: boat.pricePerDay,
        lengthInM: boat.lengthInM,
        // These constraints are enforced at object creation.
        maxSpeedInKmH: boat.maxSpeedInKmH,
        sailAreaInM2: boat.sailAreaInM2,
      };

      return detailData;
    } else {
      return null;
    }
  }

  /**
   * Get all boats as BoatOverviewData.
   *
   * @returns an array of BoatOverviewData
   */
  public async getBoatsOverviewData(): Promise<BoatOverviewData[]> {
    const boats = await this.returnAllBoats();

    return boats.map(this.boatInstanceToOverviewData);
  }

  /**
   * adds a boat to the database if possible (name and registration have to be unique)
   * @param name name of new boat
   * @param registrationNumber registration number of new boat
   * @param pricePerDay price per day of boat
   * @param skipperRequired boolean describing whether or not a skipper is needed
   * @param imageRoute route to the image of the boat
   * @param lengthInM length in meters of the boat
   * @param maxOccupants maximum amount of people that can be on the boat
   * @param boatType describes the type of boat, either motor of sail
   * @param maxSpeedInKmH optional, only motor boats can have a max speed
   * @param sailAreaInM2 optional, only sail boats can have a sail area in square meters
   * @returns an object of the created boat, or an error message if for example name or registration number are already in use
   */
  public async addBoat(
    name: string,
    registrationNumber: number,
    pricePerDay: number,
    skipperRequired: boolean,
    imageRoute: string,
    lengthInM: number,
    maxOccupants: number,
    boatType: BoatType,
    maxSpeedInKmH: number,
    sailAreaInM2: number
  ): Promise<void> {
    return this.boatDao.saveNewBoat(
      new Boat(
        name,
        registrationNumber,
        pricePerDay,
        skipperRequired,
        false,
        imageRoute,
        lengthInM,
        maxOccupants,
        boatType,
        [],
        maxSpeedInKmH ?? null,
        sailAreaInM2 ?? null
      )
    );
  }

  /**
   * deletes a boat by id from the database
   * @param idOfBoat id of the boat to identify the specific boat
   */
  public async deleteBoat(idOfBoat: number): Promise<void> {
    return this.boatDao.deleteBoat(idOfBoat);
  }

  /**
   * updates the maintenance boolean in a specific boat found by id
   * @param idOfBoat id of the boat to be updated
   * @param updatedValue new boolean value to which the maintenance boolean of the boat will be updated
   */
  public async updateMaintenanceOfBoat(
    idOfBoat: number,
    updatedValue: boolean
  ): Promise<void> {
    return this.boatDao.updateMaintenanceValueInBoat(idOfBoat, updatedValue);
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
    const boats = await BoatModel.findAll();

    // Can't use async function with filter, get and await availability first.
    const availability = await Promise.all(
      boats.map((boat) => boat.isAvailable(dateStart, dateEnd))
    );

    // Then filter with indices.
    const filteredBoatModels = boats.filter((_, index) => {
      return availability[index];
    });
    const filteredBoats = filteredBoatModels.map((boatModel) => {
      return Boat.fromModel(boatModel);
    });
    return filteredBoats.map(this.boatInstanceToOverviewData);
  }

  /**
   * Get all Dates for which boat with id is booked.
   *
   * @param id the id of the desired boat.
   *
   * @returns an array of Dates
   */
  public async getBookedDates(id: number): Promise<Date[]> {
    const boat = await BoatModel.findByPk(id);

    if (!boat) {
      throw new ServerError(`Boat with id ${id} doesn't exist.`);
    }

    return boat.getBookedDates();
  }
}
