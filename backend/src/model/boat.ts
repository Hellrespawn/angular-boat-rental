import { BoatRequirements, BoatType } from 'src/database/boat.dao';
import { RentalDao } from '../database/rental.dao';
import { ServerError } from '../util/error';
import { Rental } from './rental';

type BoatData = { [key: string]: any };

export abstract class Boat {
  public abstract readonly boatType: BoatType;

  public readonly registrationNumber: number;

  public readonly pricePerDay: number;

  public readonly lengthInM: number;

  public readonly maxOccupants: number;

  constructor(
    public readonly id: number,
    public readonly name: string,
    registrationNumber: number,
    pricePerDay: number,
    public readonly skipperRequired: boolean,
    public readonly maintenance: boolean,
    public readonly imageRoute: string,
    lengthInM: number,
    maxOccupants: number
  ) {
    if (this.isHigherThenZero(registrationNumber)) {
      this.registrationNumber = registrationNumber;
    } else {
      throw new ServerError('invalid registration number');
    }

    if (this.isHigherThenZero(pricePerDay)) {
      this.pricePerDay = pricePerDay;
    } else {
      throw new ServerError('invalid price per day');
    }

    if (this.isHigherThenZero(lengthInM)) {
      this.lengthInM = lengthInM;
    } else {
      throw new ServerError('invalid length');
    }

    if (this.isHigherThenZero(maxOccupants)) {
      this.maxOccupants = maxOccupants;
    } else {
      throw new ServerError('invalid maximum number of occupants');
    }
  }

  public isHigherThenZero(value: number): boolean {
    return value > 0;
  }

  public abstract getBoatData(): BoatData;

  public abstract getRequirements(): BoatRequirements;

  public static createBoat(
    name: string,
    registrationNumber: number,
    pricePerDay: number,
    skipperRequired: boolean,
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
        skipperRequired,
        false,
        imageRoute,
        lengthInM,
        maxOccupants,
        maxSpeedInKmH
      );
    } else {
      if (sailAreaInM2 === undefined) {
        throw new ServerError('sailAreaInM2 was undefined for SailBoat!');
      }

      return new SailBoat(
        -1,
        name,
        registrationNumber,
        pricePerDay,
        skipperRequired,
        false,
        imageRoute,
        lengthInM,
        maxOccupants,
        sailAreaInM2
      );
    }
  }

  public getUniversalRequirements(): BoatRequirements {
    let requirements: BoatRequirements = 'none';

    if (this.skipperRequired) {
      requirements = 'skipper';
    } else if (this.maxOccupants > 12) {
      requirements = 'license';
    }

    return requirements;
  }

  public async getRentals(): Promise<Rental[]> {
    return await new RentalDao().getRentalsByBoatId(this.id);
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

    return rentals.flatMap((rental) => rental.getDates());
  }
}

export class MotorBoat extends Boat {
  public readonly boatType = 'motor';

  public readonly maxSpeedInKmH: number;

  constructor(
    id: number,
    name: string,
    registrationNumber: number,
    pricePerDay: number,
    skipperRequired: boolean,
    maintenance: boolean,
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
      skipperRequired,
      maintenance,
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
    skipperRequired: boolean,
    maintenance: boolean,
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
      skipperRequired,
      maintenance,
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
