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

  constructor(
    private rentalService: RentalService,
    private boatService: BoatService
  ) {}

  ngOnInit(): void {
    this.getBoat();
  }

  private getBoat(): void {
    const id = this.rentalService.selectedBoatId;

    if (id) {
      this.boatService
        .getBoatDetailData(id)
        .subscribe((boat) => (this.boat = boat));
    }
  }

  public isDateSet(): boolean {
    return Boolean(this.rentalService.dateStart && this.rentalService.dateEnd);
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

    let ms =
      this.rentalService.dateEnd!.getTime() -
      this.rentalService.dateStart!.getTime();
    return ms / 1000 / 60 / 60 / 24;
  }

  public getTotalPrice(): number {
    return this.getDays() * this.boat.pricePerDay;
  }

  public confirmOrder(): void {
    //this.rentalService.addRental(this.userService.getCurrentUserId);
    this.rentalService.addRental(1).subscribe((id) => console.log(id));
    this.rentalService.reset();
  }
}
