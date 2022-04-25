import { Component, OnInit, ViewChild } from '@angular/core';
import { map, Observable } from 'rxjs';
import { BoatRequirements, BoatType } from '../boat';
import { BoatService } from '../boat-service.service';
import { BoatTypeFilter, RentalService, LicenseFilter } from './rental.service';

export type BoatOverviewData = {
  id: number;
  imageRoute: string;
  name: string;
  requirements: BoatRequirements;
  boatType: BoatType;
  maxOccupants: number;
};

@Component({
  selector: 'app-rental',
  templateUrl: './rental.component.html',
  styleUrls: ['./rental.component.scss'],
})
export class RentalComponent implements OnInit {
  public boats: BoatOverviewData[] = [];

  constructor(private rentalService: RentalService) {}

  ngOnInit(): void {
    this.getBoats();
  }

  private getBoats(): void {
    this.rentalService.boats.subscribe((boats: BoatOverviewData[]) => {
      this.boats = boats;
    });
  }

  public clearFilters(): void {
    this.rentalService.reset();
  }

  public isEnabled(boat: BoatOverviewData): Observable<boolean> {
    return this.rentalService.isEnabled(boat);
  }
}
