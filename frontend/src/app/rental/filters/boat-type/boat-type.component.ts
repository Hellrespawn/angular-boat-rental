import { Component } from '@angular/core';
import { Output, EventEmitter } from '@angular/core';
import { FilterType } from '../filters.component';

export type BoatTypeFilter = 'all' | 'sailboat' | 'motorboat';

@Component({
  selector: 'app-filters-boat-type',
  templateUrl: './boat-type.component.html',
  styleUrls: ['./boat-type.component.scss'],
})
export class BoatTypeComponent {
  @Output() public filterChangedEvent = new EventEmitter<
    [FilterType, BoatTypeFilter]
  >();

  public selectedOption: BoatTypeFilter = 'all';

  public changeFilter(): void {
    this.filterChangedEvent.emit(['boat-type', this.selectedOption]);
  }

  constructor() {}
}
