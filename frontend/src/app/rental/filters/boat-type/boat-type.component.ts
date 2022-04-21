import { Component } from '@angular/core';
import { BoatTypeFilter, RentalService } from '../../rental.service';

@Component({
  selector: 'app-filters-boat-type',
  templateUrl: './boat-type.component.html',
  styleUrls: ['./boat-type.component.scss'],
})
export class BoatTypeComponent {
  constructor(public rentalService: RentalService) {}

  public updateFilter(change: BoatTypeFilter): void {
    this.rentalService.typeFilter.next(change);
  }
}
