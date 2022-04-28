import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BoatService } from 'src/app/boat-service.service';
import { BoatDetailData } from '../boat-card/boat-details/boat-details.component';
import { BookingService } from '../booking.service';

@Component({
  selector: 'app-check',
  templateUrl: './check.component.html',
  styleUrls: ['./check.component.scss'],
})
export class CheckComponent implements OnInit {
  public dateRange: [Date, Date] | null = null;
  public boat!: BoatDetailData;

  constructor(
    private bookingService: BookingService,
    private boatService: BoatService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.getBoat();
    this.getDates();
  }

  private getBoat(): void {
    const params = this.route.snapshot.paramMap;
    const id = parseInt(params.get('boatId') ?? '');

    if (!isNaN(id)) {
      this.boatService
        .getBoatDetailData(id)
        .subscribe((boat) => (this.boat = boat));
    }
  }

  private getDates(): void {
    this.bookingService
      .getDateRange()
      .subscribe((dateRange) => (this.dateRange = dateRange));
  }

  private getCurrentUserId(): number {
    return 1;
  }

  private confirmOrder(rentalId: number): void {
    if (this.boat.requirements === 'skipper') {
      this.router.navigate(['/verhuur/schipper', rentalId]);
    } else {
      this.router.navigate(['/verhuur/betalen', rentalId]);
    }
  }

  public getButtonText(): string {
    if (this.boat && this.boat.requirements === 'skipper') {
      return 'Selecteer schipper';
    }

    return 'Nu betalen';
  }

  public isOrderValid(): boolean {
    if (this.dateRange) {
      return this.bookingService.getDays(...this.dateRange) >= 3;
    }

    return false;
  }

  public formatDate(date: Date): string {
    return date.toLocaleDateString();
  }

  public requirementsToString(): string {
    return this.boatService.requirementsToString(this.boat!);
  }

  public getDays(): number {
    const [dateStart, dateEnd] = this.dateRange!;

    return this.bookingService.getDays(dateStart, dateEnd);
  }

  public getTotalPrice(): number {
    return this.getDays() * this.boat!.pricePerDay;
  }

  public handleButton(): void {
    this.bookingService
      .createRental(this.boat!.id, this.getCurrentUserId())
      .subscribe(this.confirmOrder.bind(this));
  }
}
