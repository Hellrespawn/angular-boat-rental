import { Directive } from '@angular/core';
import { Boat, BoatOverviewData } from '../../boat';
import { BookingService } from '../booking.service';

@Directive()
export abstract class BaseFilterComponent<T> {
  constructor(public bookingService: BookingService) {}

  /**
   * Updates the filter with `value`.
   */
  public abstract updateFilter(value: T): void;
}

export abstract class BookingFilter {
  public abstract apply(boat: BoatOverviewData): boolean;
}
