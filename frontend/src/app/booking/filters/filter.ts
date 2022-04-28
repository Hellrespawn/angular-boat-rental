import { Directive } from '@angular/core';
import { BookingService } from '../booking.service';

@Directive()
export abstract class BaseFilter<T> {
  constructor(public bookingService: BookingService) {}

  public abstract updateFilter(change: T): void;
}
