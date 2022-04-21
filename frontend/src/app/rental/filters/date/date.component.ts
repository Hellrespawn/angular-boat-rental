import { Component } from '@angular/core';
import { RentalService } from '../../rental.service';

@Component({
  selector: 'app-filters-date',
  templateUrl: './date.component.html',
  styleUrls: ['./date.component.scss'],
})
export class DateComponent {
  public lastStartDate: Date | null = null;
  public selectedStartDate: Date | null = null;
  public selectedEndDate: Date | null = null;

  public now(): Date {
    return new Date();
  }

  constructor(public rentalService: RentalService) {}
}
