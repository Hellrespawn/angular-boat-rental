import { Directive } from '@angular/core';
import { BoatOverviewData } from '../../boat';
import { BookingService } from '../booking.service';

@Directive()
export abstract class FilterComponent<T> {
  constructor(public bookingService: BookingService) {}

  /**
   * Updates the filter with `value`.
   */
  public abstract updateFilter(value: T): void;
}

export interface BookingFilter {
  apply(boat: BoatOverviewData): boolean;
}
