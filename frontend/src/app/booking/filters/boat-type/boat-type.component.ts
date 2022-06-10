import { Component } from '@angular/core';
import { BoatOverviewData, BoatType } from '../../../boat';
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

export class BoatTypeFilter extends BookingFilter {
  constructor(public state: BoatTypeFilterState) {
    super();
  }

  public apply(boat: BoatOverviewData): boolean {
    switch (this.state) {
      case 'all':
        return true;

      case 'motor':
        return boat.boatType === 'motor';

      case 'sail':
        return boat.boatType === 'sail';
    }
  }
}
