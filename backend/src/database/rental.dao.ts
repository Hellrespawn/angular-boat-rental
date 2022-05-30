import {
  AllowNull,
  BelongsTo,
  Column,
  ForeignKey,
  Model,
  Table,
  Default,
} from 'sequelize-typescript';
import { UserModel } from './user.dao';
import { BoatModel } from './boat.dao';
import { SkipperModel } from './skipper.dao';

@Table
export class RentalModel extends Model {
  @ForeignKey(() => BoatModel)
  @AllowNull(false)
  @Column
  public boatId!: number;

  @BelongsTo(() => BoatModel)
  public boat!: BoatModel;

  @ForeignKey(() => UserModel)
  @AllowNull(false)
  @Column
  public userId!: number;

  @BelongsTo(() => UserModel)
  public user!: UserModel;

  @ForeignKey(() => SkipperModel)
  @Column
  public skipperId?: number;

  @BelongsTo(() => SkipperModel)
  public skipper?: SkipperModel;

  @AllowNull(false)
  @Column
  public dateStart!: Date;

  @AllowNull(false)
  @Column
  public dateEnd!: Date;

  @Default(false)
  @Column
  public paid!: boolean;

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
    const boat = this.boat ?? (await this.$get('boat'));

    const skipper: SkipperModel | null =
      this.skipper ?? (await this.$get('skipper'));

    const days = RentalModel.days(this.dateStart, this.dateEnd);
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