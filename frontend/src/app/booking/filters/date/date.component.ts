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
  @Input() public boatId?: number;
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
    this.getBookedDates();
  }

  /**
   * Subscribe to bookingService.dateRange
   */
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

  /**
   * If boatId is provided, get dates when boat is booked.
   */
  private getBookedDates(): void {
    if (this.boatId) {
      this.boatService
        .getBookedDates(this.boatId)
        .subscribe((bookedDates) => (this.bookedDates = bookedDates));
    }
  }

  /**
   * Returns true if both dates are on the same day.
   */
  private isSameDay(date1: Date, date2: Date): boolean {
    return (
      date1.getFullYear() == date2.getFullYear() &&
      date1.getMonth() == date2.getMonth() &&
      date1.getDate() == date2.getDate()
    );
  }

  /**
   * Returns the minimum date for the datepicker.
   */
  public getMinimumDate(): Date {
    const date = new Date();
    date.setDate(date.getDate() + 1);
    return date;
  }

  /**
   * Returns true if the boat is booked at any point between the selected dates.
   */
  private isBookedBetweenRange(): boolean {
    return this.bookedDates.some(
      (date) => this.dateStart! < date && this.dateEnd! > date
    );
  }

  /**
   * Checks if the selected dates are valid.
   */
  private areDatesValid(): boolean {
    if (this.dateStart && this.dateEnd) {
      return this.bookingService.isRangeValid(this.dateStart, this.dateEnd);
    }

    return false;
  }

  /**
   * This function disables all booked dates in the datepicker.
   *
   * Normal function definitions or using .bind(this) all freeze the
   * datepicker. This workaround was found here:
   * https://stackoverflow.com/questions/47204329/matdatepickerfilter-filter-function-cant-access-class-variable
   */
  public dateFilter = (date1: Date): boolean => {
    return Boolean(
      !this.bookedDates.find((date2) => this.isSameDay(date1, date2))
    );
  };

  /**
   * Updates this.dateStart
   * @param change
   */
  public updateDateStart(change: Date | null): void {
    this.dateStart = change;
  }

  /**
   * Updates this.dateEnd and the dateRange
   * @param change
   */
  public updateDateEnd(change: Date | null): void {
    this.dateEnd = change;

    // Doing this in ngModelChange means Angular doesn't notice when
    // this.dateEnd is nulled out. Adding a small delay fixes this.
    if (change && this.dateStart) {
      setTimeout(this.updateDateRange.bind(this), 10);
    }
  }

  /**
   * Updates the selected dateRange in bookingService.
   */
  private updateDateRange(): void {
    let dateRange: [Date, Date] | null;

    if (!this.areDatesValid()) {
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
