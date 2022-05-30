import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BoatDetailData } from 'src/app/boat';
import { BoatService } from 'src/app/boat.service';
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
  public dateRange: [Date, Date] | null = null;
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
        .getBoatDetailData(id)
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
   * Get correct text for button.
   */
  public getButtonText(): string {
    if (this.boat && this.boat.requirements === 'skipper') {
      return 'Selecteer schipper';
    }

    return 'Nu betalen';
  }

  /**
   * Returns true if the current order is valid.
   */
  public isOrderValid(): boolean {
    if (this.dateRange) {
      return this.bookingService.getDays(...this.dateRange) >= 3;
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
    const [dateStart, dateEnd] = this.dateRange!;

    return this.bookingService.getDays(dateStart, dateEnd);
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
    this.bookingService.createRental(this.boat!.id).subscribe((rentalId) => {
      if (this.boat.requirements === 'skipper') {
        this.router.navigate(['/verhuur/schipper', rentalId]);
      } else {
        this.router.navigate(['/verhuur/betalen', rentalId]);
      }
    });
  }
}
