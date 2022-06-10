import { Component } from '@angular/core';
import { BoatOverviewData } from '../../../boat';
import { FilterComponent, BookingFilter } from '../filter';

@Component({
  selector: 'app-filters-license',
  templateUrl: './license.component.html',
  styleUrls: ['../filter.scss'],
})
export class LicenseFilterComponent extends FilterComponent<LicenseFilterState> {
  public updateFilter(value: LicenseFilterState): void {
    this.bookingService.setLicenseFilter(value);
  }
}

export type LicenseFilterState = 'both' | 'required' | 'not-required';

export class LicenseFilter extends BookingFilter {
  constructor(public state: LicenseFilterState) {
    super();
  }

  public apply(boat: BoatOverviewData): boolean {
    switch (this.state) {
      case 'both':
        return true;

      case 'required':
        return boat.requirements === 'license';

      case 'not-required':
        return boat.requirements === 'none';

      default:
        return false;
    }
  }
}
