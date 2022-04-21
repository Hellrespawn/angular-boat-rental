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

  public changeFilter(): void {
    // Reset endDate if startDate changed.
    if (this.selectedStartDate != this.lastStartDate) {
      this.selectedEndDate = null;
      this.lastStartDate = this.selectedStartDate;
    }

    // Only emit event if both are filled in
    if (this.selectedStartDate && this.selectedEndDate) {
      this.rentalService.dateFilter = [
        this.selectedStartDate,
        this.selectedEndDate,
      ];
    }
  }

  constructor(private rentalService: RentalService) {
    const dateRange = rentalService.dateFilter;
    if (dateRange) {
      const [startDate, endDate] = dateRange;
      this.selectedStartDate = this.lastStartDate = startDate;
      this.selectedEndDate = endDate;
    }
  }
}
