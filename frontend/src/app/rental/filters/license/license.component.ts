import { Component } from '@angular/core';
import { FilterService, LicenseFilter } from '../../filter.service';

@Component({
  selector: 'app-filters-license',
  templateUrl: './license.component.html',
  styleUrls: ['./license.component.scss'],
})
export class LicenseComponent {
  public selectedOption: LicenseFilter = 'both';

  public changeFilter(): void {
    this.filterService.setLicenseFilter(this.selectedOption);
  }

  constructor(private filterService: FilterService) {}
}
