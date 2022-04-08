import { Component } from '@angular/core';
import { Output, EventEmitter } from '@angular/core';

export type FilterType = 'license' | 'boat-type';

@Component({
  selector: 'app-rental-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.scss'],
})
export class FiltersComponent {
  @Output() public filterChangedEvent = new EventEmitter<
    [FilterType, string]
  >();

  constructor() {}

  public changeFilter(change: [FilterType, string]): void {
    this.filterChangedEvent.emit(change);
  }
}
