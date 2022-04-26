import { Component } from '@angular/core';
import { BoatTypeFilter } from '../../rental.service';
import { BaseFilter } from '../filter';

@Component({
  selector: 'app-filters-boat-type',
  templateUrl: './boat-type.component.html',
  styleUrls: ['../filter.scss'],
})
export class BoatTypeComponent extends BaseFilter<BoatTypeFilter> {
  public updateFilter(change: BoatTypeFilter): void {
    this.rentalService.typeFilter.next(change);
  }
}
