import { Component } from '@angular/core';
import { LicenseFilter } from '../../rental.service';
import { BaseFilter } from '../filter';

@Component({
  selector: 'app-filters-license',
  templateUrl: './license.component.html',
  styleUrls: ['../filter.scss'],
})
export class LicenseComponent extends BaseFilter<LicenseFilter> {
  public updateFilter(change: LicenseFilter): void {
    this.rentalService.licenseFilter.next(change);
  }
}
