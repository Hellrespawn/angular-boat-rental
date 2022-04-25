import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { requirementsToString } from 'src/app/boat';
import { BoatOverviewData } from '../../rental.component';
import { RentalService } from '../../rental.service';

export type BoatDetailData = BoatOverviewData & {
  registrationNumber: number;
  pricePerDay: number;
  lengthInM: number;
  maxSpeedInKmH?: number;
  sailAreaInM2?: number;
};

@Component({
  selector: 'app-boat-details',
  templateUrl: './boat-details.component.html',
  styleUrls: ['./boat-details.component.scss'],
})
export class BoatDetailsComponent implements OnInit {
  public boat!: BoatDetailData;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { id: number },
    private rentalService: RentalService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getBoat();
  }

  private getBoat(): void {
    this.rentalService
      .getBoatDetailData(this.data.id)
      .subscribe((boat) => (this.boat = boat));
  }

  public selectBoat(): void {
    this.rentalService.selectedBoatId = this.boat.id;
    this.router.navigate(['/verhuur/bevestig']);
  }

  public requirementsToString(): string {
    return requirementsToString(this.boat);
  }
}
