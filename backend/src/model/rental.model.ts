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

@Table
export class Rental extends Model {
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
  public date_start!: Date;

  @AllowNull(false)
  @Column
  public date_end!: Date;

  @AllowNull(false)
  @Column
  public paid!: boolean;

  private days(): number {
    const ms = this.date_end.getTime() - this.date_start.getTime();
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
    return date >= this.date_start && date <= this.date_end;
  }

  private isRentalBetweenDates(date_start: Date, date_end: Date): boolean {
    return this.date_start >= date_start && this.date_end <= date_end;
  }

  public isAvailable(date_start: Date, date_end: Date): boolean {
    return (
      !this.isDateDuringRental(date_start) &&
      !this.isDateDuringRental(date_end) &&
      !this.isRentalBetweenDates(date_start, date_end)
    );
  }

  public isUpcoming(): boolean {
    return this.date_start > new Date();
  }

  public isCurrent(): boolean {
    return !this.isDateDuringRental(new Date());
  }
}
