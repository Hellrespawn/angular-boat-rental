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
  public skipperId!: number;

  @BelongsTo(() => Skipper)
  public skipper!: Skipper;

  @AllowNull(false)
  @Column
  public date_start!: Date;

  @AllowNull(false)
  @Column
  public date_end!: Date;
}
