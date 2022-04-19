import { Component } from '@angular/core';
import { Output, EventEmitter } from '@angular/core';
import { BoatTypeFilter } from './boat-type/boat-type.component';
import { DateFilter } from './date/date.component';
import { LicenseFilter } from './license/license.component';

@Component({
  selector: 'app-rental-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.scss'],
})
export class FiltersComponent {
  @Output() public typeFilterChangedEvent = new EventEmitter<BoatTypeFilter>();

  @Output() public licenseFilterChangedEvent =
    new EventEmitter<LicenseFilter>();

  @Output() public dateFilterChangedEvent = new EventEmitter<DateFilter>();

  constructor() {}

  public changeTypeFilter(change: BoatTypeFilter): void {
    this.typeFilterChangedEvent.emit(change);
  }

  public changeLicenseFilter(change: LicenseFilter): void {
    this.licenseFilterChangedEvent.emit(change);
  }

  public changeDateFilter(change: DateFilter): void {
    this.dateFilterChangedEvent.emit(change);
  }
}
