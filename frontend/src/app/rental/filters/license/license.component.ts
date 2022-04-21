import { Component } from '@angular/core';
import { RentalService, LicenseFilter } from '../../rental.service';

@Component({
  selector: 'app-filters-license',
  templateUrl: './license.component.html',
  styleUrls: ['./license.component.scss'],
})
export class LicenseComponent {
  constructor(public rentalService: RentalService) {}

  public updateFilter(change: LicenseFilter): void {
    this.rentalService.licenseFilter.next(change);
  }
}
