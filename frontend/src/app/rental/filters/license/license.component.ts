import { Component } from '@angular/core';
import { Output, EventEmitter } from '@angular/core';

export type LicenseFilter = 'both' | 'required' | 'not-required';

@Component({
  selector: 'app-filters-license',
  templateUrl: './license.component.html',
  styleUrls: ['./license.component.scss'],
})
export class LicenseComponent {
  @Output() public licenseFilterChangedEvent =
    new EventEmitter<LicenseFilter>();

  public selectedOption: LicenseFilter = 'both';

  public changeFilter(): void {
    this.licenseFilterChangedEvent.emit(this.selectedOption);
  }

  constructor() {}
}
