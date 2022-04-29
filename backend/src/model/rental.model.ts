import {
  AllowNull,
  BelongsTo,
  Column,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Boat } from './boat.model';
import { User } from './user.model';
import { Skipper } from './skipper.model';

@Table
export class Rental extends Model {
  @ForeignKey(() => Boat)
  @AllowNull(false)
  @Column
  public boatId!: number;

  @BelongsTo(() => Boat)
  public boat!: Boat;

  @ForeignKey(() => User)
  @AllowNull(false)
  @Column
  public userId!: number;

  @BelongsTo(() => User)
  public user!: User;

  @ForeignKey(() => Skipper)
  @Column
  public skipperId?: number;

  @BelongsTo(() => Skipper)
  public skipper?: Skipper;

  @AllowNull(false)
  @Column
  public dateStart!: Date;

  @AllowNull(false)
  @Column
  public dateEnd!: Date;

  @AllowNull(false)
  @Column
  public paid!: boolean;

  /**
   * Returns the number of days between dateStart and dateEnd (inclusive)
   */
  public days(): number {
    const ms = this.dateEnd.getTime() - this.dateStart.getTime();
    return Math.ceil(ms / 1000 / 60 / 60 / 24) + 1;
  }

  /**
   * Returns the total price of the rental.
   */
  public async priceTotal(): Promise<number> {
    const boat = this.boat ?? (await this.$get('boat'));

    const skipper: Skipper | null =
      this.skipper ?? (await this.$get('skipper'));

    const days = this.days();
    let total = days * boat.pricePerDay;
    if (skipper) {
      total += days * skipper.pricePerDay;
    }

    return total;
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
    return !this.isDateDuringRental(new Date());
  }
}
