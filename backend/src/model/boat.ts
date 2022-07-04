import { type BoatRequirements, type BoatType } from 'auas-common';
import { BoatDao } from '../persistence/boat.dao';
import { RentalDao } from '../persistence/rental.dao';
import { ServerError } from '../util/error';
import { Rental } from './rental';

type BoatData = Record<string, boolean | number | string>;

export abstract class Boat {
  public abstract readonly boatType: BoatType;

  protected constructor(
    public readonly registrationNumber: number,
    public readonly pricePerDay: number,
    public readonly imageRoute: string,
    public readonly lengthInM: number,
    public readonly maxPassengers: number,
    public readonly name?: string
  ) {}

  public static async createBoat(
    registrationNumber: number,
    pricePerDay: number,
    imageRoute: string,
    lengthInM: number,
    maxPassengers: number,
    boatType: BoatType,
    name?: string,
    maxSpeedInKmH?: number,
    sailAreaInM2?: number
  ): Promise<Boat> {
    await this.validateRegistrationNumber(registrationNumber);

    this.validateBoatData(boatType, maxSpeedInKmH, sailAreaInM2);

    Object.entries({
      pricePerDay,
      lengthInM,
      maxPassengers,
      maxSpeedInKmH,
      sailAreaInM2,
    }).forEach(([key, value]) => {
      if (value) {
        this.validateGreaterThanZero(key, value);
      }
    });

    if (boatType === 'motor') {
      if (maxSpeedInKmH === undefined) {
        throw new ServerError('maxSpeedInKmH was undefined for MotorBoat!');
      }

      return new MotorBoat(
        registrationNumber,
        pricePerDay,
        imageRoute || 'motorboat-placeholder.jpg',
        lengthInM,
        maxPassengers,
        maxSpeedInKmH,
        name
      );
    }

    if (sailAreaInM2 === undefined) {
      throw new ServerError('sailAreaInM2 was undefined for SailBoat!');
    }

    return new SailBoat(
      registrationNumber,
      pricePerDay,
      imageRoute || 'sailboat-placeholder.jpg',
      lengthInM,
      maxPassengers,
      sailAreaInM2,
      name
    );
  }

  private static async validateRegistrationNumber(
    registrationNumber: number
  ): Promise<void> {
    if (
      await BoatDao.getInstance().checkRegistrationNumberExists(
        registrationNumber
      )
    ) {
      throw new ServerError(
        `Registration Number ${registrationNumber} is already in use!`
      );
    }
  }

  private static validateBoatData(
    type: string,
    maxSpeedInKmH?: number,
    sailAreaInM2?: number
  ): void {
    if (type === 'motor' && typeof maxSpeedInKmH !== 'number') {
      throw new ServerError('MotorBoat must be accompanied by maxSpeedInKmH');
    }

    if (type === 'sail' && typeof sailAreaInM2 !== 'number') {
      throw new ServerError('SailBoat must be accompanied by sailAreaInM2');
    }
  }

  private static validateGreaterThanZero(name: string, value: number): void {
    if (value <= 0) {
      throw new ServerError(`${name} must be greater than 0, found ${value}`);
    }
  }

  /**
   * Gets all rentals associated with boat
   * @returns array of rentals
   */
  public getRentals(): Promise<Rental[]> {
    return RentalDao.getInstance().getRentalsByBoatRegistrationNumber(
      this.registrationNumber
    );
  }

  /**
   * Checks all rentals for this boat to see if it's available.
   *
   * @param dateStart start of period to check
   * @param dateEnd end of period to check
   * @returns whether or not the boat is available
   */
  public async isAvailable(dateStart: Date, dateEnd: Date): Promise<boolean> {
    const rentals = await this.getRentals();
    return rentals.every((r) => !r.areDatesOverlapping(dateStart, dateEnd));
  }

  /**
   * Returns an all booked dates.
   *
   * @returns array of booked dates
   */
  public async getBookedDates(): Promise<Date[]> {
    const rentals = await this.getRentals();

    return rentals.flatMap((rental) => rental.getBookedDates());
  }

  /**
   * Checks the requirements common to all boats
   */
  protected getUniversalRequirements(): BoatRequirements {
    let requirements: BoatRequirements = 'none';

    if (this.maxPassengers > 12) {
      requirements = 'license';
    }

    return requirements;
  }

  /**
   * Gets specific data associated with subclass
   */
  public abstract getBoatData(): BoatData;

  /**
   * Gets boat requirements
   */
  public abstract getRequirements(): BoatRequirements;
}

export class MotorBoat extends Boat {
  public readonly boatType = 'motor';

  constructor(
    registrationNumber: number,
    pricePerDay: number,
    imageRoute: string,
    lengthInM: number,
    maxPassengers: number,
    public readonly maxSpeedInKmH: number,
    name?: string
  ) {
    super(
      registrationNumber,
      pricePerDay,
      imageRoute,
      lengthInM,
      maxPassengers,
      name
    );
    // TODO Validate new MotorBoat
  }

  public getBoatData(): BoatData {
    return { maxSpeedInKmH: this.maxSpeedInKmH };
  }

  public getRequirements(): BoatRequirements {
    let requirements = this.getUniversalRequirements();

    if (requirements === 'none' && this.maxSpeedInKmH > 20) {
      requirements = 'license';
    }

    return requirements;
  }
}

export class SailBoat extends Boat {
  public readonly boatType = 'sail';
  constructor(
    registrationNumber: number,
    pricePerDay: number,
    imageRoute: string,
    lengthInM: number,
    maxPassengers: number,
    public readonly sailAreaInM2: number,
    name?: string
  ) {
    super(
      registrationNumber,
      pricePerDay,
      imageRoute,
      lengthInM,
      maxPassengers,
      name
    );
    // TODO Validate new SailBoat
  }

  public getBoatData(): BoatData {
    return { sailAreaInM2: this.sailAreaInM2 };
  }

  public getRequirements(): BoatRequirements {
    let requirements = this.getUniversalRequirements();

    if (requirements === 'none' && this.sailAreaInM2 > 150) {
      requirements = 'license';
    }

    return requirements;
  }
}
