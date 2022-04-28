import { Directive } from '@angular/core';
import { BookingService } from '../booking.service';

@Directive()
export abstract class BaseFilter<T> {
  constructor(public bookingService: BookingService) {}

  /**
   * Updates the filter with `value`.
   */
  public abstract updateFilter(value: T): void;
}
