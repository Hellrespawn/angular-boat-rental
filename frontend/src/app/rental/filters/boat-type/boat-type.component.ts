import { Component } from '@angular/core';
import { BoatTypeFilter, RentalService } from '../../rental.service';

@Component({
  selector: 'app-filters-boat-type',
  templateUrl: './boat-type.component.html',
  styleUrls: ['./boat-type.component.scss'],
})
export class BoatTypeComponent {
  public selectedOption: BoatTypeFilter;

  public changeFilter(): void {
    this.rentalService.typeFilter = this.selectedOption;
  }

  constructor(private rentalService: RentalService) {
    this.selectedOption = rentalService.typeFilter;
  }
}
