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
  public dateStart?: Date;
  public dateEnd?: Date;

  constructor(
    private rentalService: RentalService,
    private boatService: BoatService
  ) {}

  ngOnInit(): void {
    this.getBoat();
    this.getDates();
  }

  private getBoat(): void {
    const id = this.rentalService.selectedBoatId;

    if (id) {
      this.boatService
        .getBoatDetailData(id)
        .subscribe((boat) => (this.boat = boat));
    }
  }

  private getDates(): void {
    const dateRange = this.rentalService.dateFilter;

    if (dateRange) {
      [this.dateStart, this.dateEnd] = dateRange;
    }
  }

  public formatDate(date: Date): string {
    return date.toLocaleDateString();
  }

  public requirementsToString(): string {
    return requirementsToString(this.boat);
  }

  public getDays(): number {
    if (!this.dateStart || !this.dateEnd) {
      return NaN;
    }

    let ms = this.dateEnd.getTime() - this.dateStart.getTime();
    return ms / 1000 / 60 / 60 / 24;
  }

  public getTotalPrice(): number {
    return this.getDays() * this.boat.pricePerDay;
  }
}
