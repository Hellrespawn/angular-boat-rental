import { Component } from '@angular/core';
import { Output, EventEmitter } from '@angular/core';
import { FilterType } from '../filters.component';

export type LicenseFilter = 'both' | 'required' | 'not-required';

@Component({
  selector: 'app-filters-license',
  templateUrl: './license.component.html',
  styleUrls: ['./license.component.scss'],
})
export class LicenseComponent {
  @Output() public filterChangedEvent = new EventEmitter<
    [FilterType, LicenseFilter]
  >();

  public selectedOption: LicenseFilter = 'both';

  public changeFilter(): void {
    this.filterChangedEvent.emit(['license', this.selectedOption]);
  }

  constructor() {}
}
