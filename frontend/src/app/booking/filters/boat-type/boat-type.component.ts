import { Component } from '@angular/core';
import { type BoatOverviewData, type BoatType } from 'auas-common';
import { FilterComponent, BookingFilter } from '../filter';

@Component({
  selector: 'app-filters-boat-type',
  templateUrl: './boat-type.component.html',
  styleUrls: ['../filter.scss'],
})
export class BoatTypeFilterComponent extends FilterComponent<BoatTypeFilterState> {
  public updateFilter(value: BoatTypeFilterState): void {
    this.bookingService.setTypeFilter(value);
  }
}

export type BoatTypeFilterState = 'all' | BoatType;

export class BoatTypeFilter implements BookingFilter {
  constructor(public state: BoatTypeFilterState) {}

  public apply(boat: BoatOverviewData): boolean {
    switch (this.state) {
      case 'all':
        return true;

      case 'motor':
        return boat.boatType === 'motor';

      case 'sail':
        return boat.boatType === 'sail';

      default:
        throw new Error(`Invalid boat type '${this.state}'`);
    }
  }
}
