import { Component } from '@angular/core';
import { RentalService, LicenseFilter } from '../../rental.service';

@Component({
  selector: 'app-filters-license',
  templateUrl: './license.component.html',
  styleUrls: ['./license.component.scss'],
})
export class LicenseComponent {
  public selectedOption: LicenseFilter = 'both';

  public changeFilter(): void {
    this.rentalService.licenseFilter = this.selectedOption;
  }

  constructor(private rentalService: RentalService) {
    this.selectedOption = rentalService.licenseFilter;
  }
}
