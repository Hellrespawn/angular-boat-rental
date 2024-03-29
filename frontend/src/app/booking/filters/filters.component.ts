import { BreakpointObserver } from '@angular/cdk/layout';
import { Component } from '@angular/core';
import { map, Observable } from 'rxjs';
import { BookingService } from '../booking.service';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.scss'],
})
export class FiltersComponent {
  constructor(
    private breakpointObserver: BreakpointObserver,
    private bookingService: BookingService
  ) {}

  /**
   * Observable that checks whether or not we're on mobile. '$'-suffix is an
   * RxJS convention.
   */
  public isMobile$: Observable<boolean> = this.breakpointObserver
    .observe(['(max-width: 640px)'])
    .pipe(map((state) => state.matches));

  /**
   * Reset all filters
   */
  public resetFilters(): void {
    this.bookingService.reset();
  }
}
