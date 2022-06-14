import { RentalModel } from '../database/rental.dao';
import { Boat } from './boat';
import { Skipper } from './skipper';
import { User } from './user';

export class Rental {
  constructor(
    public readonly id: number,
    public readonly boat: Boat,
    public readonly user: User,
    public readonly dateStart: Date,
    public readonly dateEnd: Date,
    public readonly paid: boolean,
    public readonly skipper?: Skipper
  ) {}

  public static fromModel(model: RentalModel): Rental {
    return new Rental(
      model.id,
      model.boat.toBoat(),
      User.fromModel(model.user),
      model.dateStart,
      model.dateEnd,
      model.paid,
      model.skipper
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
   * Returns the total price of the rental.
   */
  public async priceTotal(): Promise<number> {
    const days = Rental.days(this.dateStart, this.dateEnd);
    let total = days * this.boat.pricePerDay;
    if (this.skipper) {
      total += days * this.skipper.pricePerDay;
    }

    return total;
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
  public getDates(): Date[] {
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

  public isUpcoming(): boolean {
    return this.dateStart > new Date();
  }

  public isCurrent(): boolean {
    return this.isDateDuringRental(new Date());
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
