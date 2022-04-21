import { importExpr } from '@angular/compiler/src/output/output_ast';
import { Component, Input, OnInit } from '@angular/core';
import { BoatService } from 'src/app/boat-service.service';
import { RentalService } from '../../rental.service';

@Component({
  selector: 'app-filters-date',
  templateUrl: './date.component.html',
  styleUrls: ['./date.component.scss'],
})
export class DateComponent implements OnInit {
  @Input() public boatId!: number;
  private bookedDates: Date[] = [];
  public dateStart: Date | null = null;
  public dateEnd: Date | null = null;

  constructor(public rentalService: RentalService) {}

  ngOnInit(): void {
    this.getDateRange();

    if (this.boatId) {
      this.getBookedDates();
    }
  }

  private getDateRange(): void {
    this.rentalService.dateRange.subscribe((dateRange) => {
      if (dateRange) {
        const [dateStart, dateEnd] = dateRange;

        this.dateStart = dateStart;
        this.dateEnd = dateEnd;
      } else {
        this.dateStart = null;
        this.dateEnd = null;
      }
    });
  }

  private getBookedDates(): void {
    this.rentalService
      .getBookedDates(this.boatId)
      .subscribe((bookedDates) => (this.bookedDates = bookedDates));
  }

  private isSameDay(date1: Date, date2: Date): boolean {
    return (
      date1.getFullYear() == date2.getFullYear() &&
      date1.getMonth() == date2.getMonth() &&
      date1.getDate() == date2.getDate()
    );
  }

  public now(): Date {
    return new Date();
  }

  // Normal function definitions or using .bind(this) all freeze the
  // datepicker. This workaround was found here:
  // https://stackoverflow.com/questions/47204329/matdatepickerfilter-filter-function-cant-access-class-variable
  public dateFilter = (date1: Date): boolean => {
    return Boolean(
      !this.bookedDates.find((date2) => this.isSameDay(date1, date2))
    );
  };

  public updateDateStart(change: Date | null): void {
    this.dateStart = change;
  }

  public updateDateEnd(change: Date | null): void {
    this.dateEnd = change;
    if (this.dateEnd && this.dateStart) {
      const dateRange: [Date, Date] = [this.dateStart!, this.dateEnd!];
      this.rentalService.dateRange.next(dateRange);
    }
  }
}
