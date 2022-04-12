import { Component } from '@angular/core';
import { Output, EventEmitter } from '@angular/core';

export type BoatTypeFilter = 'all' | 'sailboat' | 'motorboat';

@Component({
  selector: 'app-filters-boat-type',
  templateUrl: './boat-type.component.html',
  styleUrls: ['./boat-type.component.scss'],
})
export class BoatTypeComponent {
  @Output() public typeFilterChangedEvent = new EventEmitter<BoatTypeFilter>();

  public selectedOption: BoatTypeFilter = 'all';

  public changeFilter(): void {
    this.typeFilterChangedEvent.emit(this.selectedOption);
  }

  constructor() {}
}
