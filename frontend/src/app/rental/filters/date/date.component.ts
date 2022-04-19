import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { MatDateRangePicker } from '@angular/material/datepicker';

export type DateFilter = [Date, Date];

@Component({
  selector: 'app-filters-date',
  templateUrl: './date.component.html',
  styleUrls: ['./date.component.scss'],
})
export class DateComponent {
  @Output() public dateFilterChangedEvent = new EventEmitter<DateFilter>();

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
      this.dateFilterChangedEvent.emit([
        this.selectedStartDate,
        this.selectedEndDate,
      ]);
    }
  }

  constructor() {}
}
