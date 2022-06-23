import { RentalModel } from '../database/rental.dao';
import { ServerError } from '../util/error';
import { Boat } from './boat';
import { Skipper } from './skipper';
import { User } from './user';

export class Rental {
  public static readonly MIN_DAYS = 3;

  constructor(
    public id: number,
    public readonly boat: Boat,
    public readonly user: User,
    public readonly dateStart: Date,
    public readonly dateEnd: Date,
    public readonly paid: boolean,
    public readonly skipper?: Skipper
  ) {}

  /**
   * Create new Rental from boat, user and dates
   *
   * @param boat
   * @param user
   * @param dateStart
   * @param dateEnd
   * @returns rental
   */
  public static async create(
    boat: Boat,
    user: User,
    dateStart: Date,
    dateEnd: Date
  ): Promise<Rental> {
    if (dateStart > dateEnd) {
      throw new ServerError('Starting date must be before end date!');
    }

    if (Rental.days(dateStart, dateEnd) < Rental.MIN_DAYS) {
      throw new ServerError(
        `Rental period must be at least ${Rental.MIN_DAYS} days!`
      );
    }

    // Check if boat is available (most performance intensive, so last)
    const isAvailable = await boat.isAvailable(dateStart, dateEnd);

    if (!isAvailable) {
      throw new ServerError(
        `Boat is not available from ${dateStart} to ${dateEnd}`
      );
    }

    return new Rental(-1, boat, user, dateStart, dateEnd, false);
  }

  /**
   * Create new rental from RentalModel
   *
   * @param model
   * @returns rental
   */
  public static fromModel(model: RentalModel): Rental {
    return new Rental(
      model.id,
      model.boat.toBoat(),
      User.fromModel(model.user),
      model.dateStart,
      model.dateEnd,
      model.paid,
      model.skipper ? Skipper.fromModel(model.skipper) : undefined
    );
  }

  /**
   * Returns the number of days between dateStart and dateEnd (inclusive)
   */
  public static days(dateStart: Date, dateEnd: Date): number {
    const ms = dateEnd.getTime() - dateStart.getTime();
    return Math.ceil(ms / 1000 / 60 / 60 / 24) + 1;
  }

  /**
   * Checks if dateStart and dateEnd overlaps the rental period.
   */
  public areDatesOverlapping(dateStart: Date, dateEnd: Date): boolean {
    return (
      this.isDateDuringRental(dateStart) ||
      this.isDateDuringRental(dateEnd) ||
      this.isRentalBetweenDates(dateStart, dateEnd)
    );
  }

  /**
   * Returns an array with all booked dates.
   */
  public getBookedDates(): Date[] {
    const dates: Date[] = [];
    for (
      let date = new Date(this.dateStart);
      date <= new Date(this.dateEnd);
      date.setDate(date.getDate() + 1)
    ) {
      dates.push(new Date(date));
    }
    return dates;
  }

  /**
   * Returns true if date is during the rental period.
   */
  private isDateDuringRental(date: Date): boolean {
    return date >= this.dateStart && date <= this.dateEnd;
  }

  /**
   * Returns true if the rental period is between dateStart and dateEnd.
   */
  private isRentalBetweenDates(dateStart: Date, dateEnd: Date): boolean {
    return this.dateStart >= dateStart && this.dateEnd <= dateEnd;
  }
}
