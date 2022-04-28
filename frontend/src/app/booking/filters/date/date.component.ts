import { Component, Input, OnInit } from '@angular/core';
import { BoatService } from 'src/app/boat.service';
import { SnackBarService } from 'src/app/snack-bar.service';
import { BookingService } from '../../booking.service';

@Component({
  selector: 'app-filters-date',
  templateUrl: './date.component.html',
  styleUrls: ['../filter.scss'],
})
export class DateComponent implements OnInit {
  @Input() public boatId!: number;
  private bookedDates: Date[] = [];
  public dateStart: Date | null = null;
  public dateEnd: Date | null = null;

  constructor(
    private boatService: BoatService,
    private bookingService: BookingService,
    private snackBarService: SnackBarService
  ) {}

  ngOnInit(): void {
    this.getDateRange();

    if (this.boatId) {
      this.getBookedDates();
    }
  }

  private getDateRange(): void {
    this.bookingService.getDateRange().subscribe((dateRange) => {
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
    this.boatService
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

  public getMinimumDate(): Date {
    const date = new Date();
    date.setDate(date.getDate() + 1);
    return date;
  }

  private isBookedBetweenRange(): boolean {
    // Selecting a booked date is disabled in the date picker, so we only need
    // to check one booked date to ensure that the current range doesn't
    // encompass it
    let earliest: Date | undefined = this.bookedDates[0];

    if (earliest) {
      return this.dateStart! < earliest && this.dateEnd! > earliest;
    } else {
      return false;
    }
  }

  private isRangeValid(): boolean {
    if (this.dateStart && this.dateEnd) {
      return this.bookingService.isRangeValid(this.dateStart, this.dateEnd);
    }

    return false;
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

    // Doing this in ngModelChange means Angular doesn't notice when
    // this.dateEnd is nulled out. Adding a small delay fixes this.
    if (change && this.dateStart) {
      setTimeout(this.updateDateRange.bind(this), 10);
    }
  }

  private updateDateRange(): void {
    let dateRange: [Date, Date] | null;

    if (!this.isRangeValid()) {
      this.snackBarService.displayError('Je moet minimaal 3 dagen huren!');
      this.dateEnd = null;
      this.dateStart = null;
      dateRange = null;
    } else if (this.isBookedBetweenRange()) {
      this.snackBarService.displayError(
        'Er zit een boeking tussen je selectie!'
      );
      this.dateEnd = null;
      this.dateStart = null;
      dateRange = null;
    } else {
      dateRange = [this.dateStart!, this.dateEnd!];
    }
    this.bookingService.setDateRange(dateRange);
  }
}
