import {
  AllowNull,
  BelongsTo,
  Column,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Boat } from './boat.model';
import { Customer } from './customer.model';
import { Skipper } from './skipper.model';

type RentalData = {
  boatId: number;
  boat: Boat;
  customerId: number;
  customer: Customer;
  skipperId?: number;
  skipper?: Skipper;
  dateStart: Date;
  dateEnd: Date;
  paid: boolean;
};

@Table
export class Rental extends Model implements RentalData {
  @ForeignKey(() => Boat)
  @AllowNull(false)
  @Column
  public boatId!: number;

  @BelongsTo(() => Boat)
  public boat!: Boat;

  @ForeignKey(() => Customer)
  @AllowNull(false)
  @Column
  public customerId!: number;

  @BelongsTo(() => Customer)
  public customer!: Customer;

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

  private days(): number {
    const ms = this.dateEnd.getTime() - this.dateStart.getTime();
    return Math.ceil(ms / 1000 / 60 / 60 / 24);
  }

  public priceTotal(): number {
    const days = this.days();

    let total = days * this.boat.pricePerDay;
    if (this.skipper) {
      total += days * this.skipper.pricePerDay;
    }

    return total;
  }

  private isDateDuringRental(date: Date): boolean {
    return date >= this.dateStart && date <= this.dateEnd;
  }

  private isRentalBetweenDates(dateStart: Date, dateEnd: Date): boolean {
    return this.dateStart >= dateStart && this.dateEnd <= dateEnd;
  }

  public areDatesOverlapping(dateStart: Date, dateEnd: Date): boolean {
    return (
      this.isDateDuringRental(dateStart) ||
      this.isDateDuringRental(dateEnd) ||
      this.isRentalBetweenDates(dateStart, dateEnd)
    );
  }

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
