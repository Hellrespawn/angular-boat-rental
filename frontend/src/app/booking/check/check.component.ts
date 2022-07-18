import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { type BoatDetailData } from 'auas-common';
import { BoatService } from 'src/app/boat.service';
import { DateRange } from '../../date';
import { SessionData } from '../../session';
import { SessionService } from '../../session.service';
import { BookingService } from '../booking.service';

@Component({
  selector: 'app-check',
  templateUrl: './check.component.html',
  styleUrls: ['./check.component.scss'],
})
export class CheckComponent implements OnInit {
  public sessionData: SessionData | null = null;
  public dateRange: DateRange | null = null;
  public boat!: BoatDetailData;

  constructor(
    private bookingService: BookingService,
    private boatService: BoatService,
    private router: Router,
    private route: ActivatedRoute,
    private sessionService: SessionService
  ) {}

  ngOnInit(): void {
    this.getSessionData();
    this.getBoat();
    this.getDates();
  }

  /**
   * Retrieve session data from SessionService
   */
  private getSessionData(): void {
    this.sessionService
      .getSessionData()
      .subscribe((sessionData) => (this.sessionData = sessionData));
  }

  /**
   * Gets boat details.
   */
  private getBoat(): void {
    const params = this.route.snapshot.paramMap;
    const id = parseInt(params.get('boatId') ?? '');

    if (!isNaN(id)) {
      this.boatService
        .getDetailData(id)
        .subscribe((boat) => (this.boat = boat));
    }
  }

  /**
   * Get current DateRange.
   */
  private getDates(): void {
    this.bookingService
      .getDateRange()
      .subscribe((dateRange) => (this.dateRange = dateRange));
  }

  /**
   * Returns true if the current order is valid.
   */
  public isOrderValid(): boolean {
    if (this.dateRange) {
      return this.bookingService.isRangeValid(this.dateRange);
    }

    return false;
  }

  /**
   * Format boat requirements for printing.
   */
  public requirementsToString(): string {
    return this.boatService.requirementsToString(this.boat!);
  }

  /**
   * Get number of days in currently selected dates.
   */
  public getDays(): number {
    return this.bookingService.getDays(this.dateRange!);
  }

  /**
   * Get total price for currently selected dates.
   */
  public getTotalPrice(): number {
    return this.getDays() * this.boat!.pricePerDay;
  }

  /**
   * Create rental and navigate to next page.
   */
  public handleButton(): void {
    if (!this.isLoggedIn()) {
      this.router.navigate(['/login'], {
        queryParams: { from: `/rent/check/${this.boat!.registrationNumber}` },
      });
    } else {
      this.bookingService
        .createRental(this.boat!.registrationNumber)
        .subscribe((rentalId) => {
          this.router.navigate(['/rent/payment', rentalId]);
        });
    }
  }

  /**
   * Returns true if there is a user logged in.
   */
  public isLoggedIn(): boolean {
    return Boolean(this.sessionData);
  }

  /**
   * Returns true when the button should be disabled
   */
  public isButtonDisabled(): boolean {
    if (!this.isLoggedIn()) {
      return false;
    } else {
      return !this.isOrderValid();
    }
  }

  /**
   * Get correct text for button.
   */
  public getButtonText(): string {
    if (!this.isLoggedIn()) {
      return 'Log in now!';
    }

    return 'Pay now!';
  }
}
