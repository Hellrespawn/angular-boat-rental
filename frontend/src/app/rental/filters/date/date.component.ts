import { Component } from '@angular/core';
import { FilterService } from '../../filter.service';

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
      this.filterService.setDateFilter([
        this.selectedStartDate,
        this.selectedEndDate,
      ]);
    }
  }

  constructor(private filterService: FilterService) {}
}
