import { Component, OnInit } from '@angular/core';
import { requirementsToString } from 'src/app/boat';
import { BoatService } from 'src/app/boat-service.service';
import { BoatDetailData } from '../boat-card/boat-details/boat-details.component';
import { RentalService } from '../rental.service';

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.scss'],
})
export class ConfirmComponent implements OnInit {
  public boat!: BoatDetailData;
  private dateRange: [Date, Date] | null = null;

  constructor(private rentalService: RentalService) {}

  ngOnInit(): void {
    this.getBoat();
    this.getDates();
  }

  private getBoat(): void {
    // BoatDetailsComponent makes sure that this is set.
    const id = this.rentalService.selectedBoatId!;

    this.rentalService
      .getBoatDetailData(id)
      .subscribe((boat) => (this.boat = boat));
  }

  private getDates(): void {
    this.rentalService.dateRange.subscribe(
      (dateRange) => (this.dateRange = dateRange)
    );
  }

  /**
   * Checks whether or not dateStart and dateEnd are set.
   */
  public isDateSet(): boolean {
    return Boolean(this.rentalService.dateRange);
  }

  public formatDate(date: Date): string {
    return date.toLocaleDateString();
  }

  public requirementsToString(): string {
    return requirementsToString(this.boat);
  }

  public getDays(): number {
    if (!this.isDateSet()) {
      return NaN;
    }

    const [dateStart, dateEnd] = this.dateRange!;

    let ms = dateEnd!.getTime() - dateStart!.getTime();
    return ms / 1000 / 60 / 60 / 24;
  }

  public getTotalPrice(): number {
    return this.getDays() * this.boat.pricePerDay;
  }

  public confirmOrder(): void {
    /**     *
     * while (!this.userService.getCurrentUser()) {
     *   loginDialog()
     * }
     *
     * this.rentalService.addRental(this.userService.getCurrentUser().id);
     */

    this.rentalService.addRental(1).subscribe((id) => {
      console.log(id);
      this.rentalService.reset();
    });
  }
}
