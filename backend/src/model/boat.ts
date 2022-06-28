import { type BoatRequirements, type BoatType } from 'src/database/boat.model';
import { RentalDao } from '../database/rental.dao';
import { ServerError } from '../util/error';
import { Rental } from './rental';

type BoatData = Record<string, boolean | number | string>;

export abstract class Boat {
  public abstract readonly boatType: BoatType;

  constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly registrationNumber: number,
    public readonly pricePerDay: number,
    public readonly imageRoute: string,
    public readonly lengthInM: number,
    public readonly maxOccupants: number
  ) {
    if (!this.isHigherThenZero(registrationNumber)) {
      throw new ServerError('invalid registration number');
    }
    if (!this.isHigherThenZero(pricePerDay)) {
      throw new ServerError('invalid price per day');
    }
    if (!this.isHigherThenZero(lengthInM)) {
      throw new ServerError('invalid length');
    }
    if (!this.isHigherThenZero(maxOccupants)) {
      throw new ServerError('invalid maximum number of occupants');
    }
  }

  public static createBoat(
    name: string,
    registrationNumber: number,
    pricePerDay: number,
    imageRoute: string,
    lengthInM: number,
    maxOccupants: number,
    boatType: BoatType,
    maxSpeedInKmH?: number,
    sailAreaInM2?: number
  ): Boat {
    if (boatType === 'motor') {
      if (maxSpeedInKmH === undefined) {
        throw new ServerError('maxSpeedInKmH was undefined for MotorBoat!');
      }

      return new MotorBoat(
        -1,
        name,
        registrationNumber,
        pricePerDay,
        imageRoute,
        lengthInM,
        maxOccupants,
        maxSpeedInKmH
      );
    }

    if (sailAreaInM2 === undefined) {
      throw new ServerError('sailAreaInM2 was undefined for SailBoat!');
    }

    return new SailBoat(
      -1,
      name,
      registrationNumber,
      pricePerDay,
      imageRoute,
      lengthInM,
      maxOccupants,
      sailAreaInM2
    );
  }

  public isHigherThenZero(value: number): boolean {
    return value > 0;
  }

  /**
   * Gets all rentals associated with boat
   * @returns array of rentals
   */
  public getRentals(): Promise<Rental[]> {
    return RentalDao.getInstance().getRentalsByBoatId(this.id);
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

    if (this.maxOccupants > 12) {
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

  public readonly maxSpeedInKmH: number;

  constructor(
    id: number,
    name: string,
    registrationNumber: number,
    pricePerDay: number,
    imageRoute: string,
    lengthInM: number,
    maxOccupants: number,
    maxSpeedInKmH: number
  ) {
    super(
      id,
      name,
      registrationNumber,
      pricePerDay,
      imageRoute,
      lengthInM,
      maxOccupants
    );
    if (this.isHigherThenZero(maxSpeedInKmH)) {
      this.maxSpeedInKmH = maxSpeedInKmH;
    } else {
      throw new ServerError('invalid maximum speed');
    }
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

  public readonly sailAreaInM2: number;

  constructor(
    id: number,
    name: string,
    registrationNumber: number,
    pricePerDay: number,
    imageRoute: string,
    lengthInM: number,
    maxOccupants: number,
    sailAreaInM2: number
  ) {
    super(
      id,
      name,
      registrationNumber,
      pricePerDay,
      imageRoute,
      lengthInM,
      maxOccupants
    );
    if (this.isHigherThenZero(sailAreaInM2)) {
      this.sailAreaInM2 = sailAreaInM2;
    } else {
      throw new ServerError('invalid sail area');
    }
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
