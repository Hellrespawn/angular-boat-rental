import { BreakpointObserver } from '@angular/cdk/layout';
import { Component } from '@angular/core';
import { map, Observable } from 'rxjs';
import { RentalService } from '../rental.service';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.scss'],
})
export class FiltersComponent {
  constructor(
    private breakpointObserver: BreakpointObserver,
    private rentalService: RentalService
  ) {}

  /** Observable that checks whether or not we're on mobile. */
  public isMobile$: Observable<boolean> = this.breakpointObserver
    .observe(['(max-width: 640px)'])
    .pipe(map((state) => state.matches));

  public clearFilters(): void {
    this.rentalService.reset();
  }
}
