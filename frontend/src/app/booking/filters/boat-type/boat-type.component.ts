import { Component } from '@angular/core';
import { BoatTypeFilter } from '../../booking.service';
import { BaseFilter } from '../filter';

@Component({
  selector: 'app-filters-boat-type',
  templateUrl: './boat-type.component.html',
  styleUrls: ['../filter.scss'],
})
export class BoatTypeComponent extends BaseFilter<BoatTypeFilter> {
  public updateFilter(value: BoatTypeFilter): void {
    this.bookingService.setTypeFilter(value);
  }
}
