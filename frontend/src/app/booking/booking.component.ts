import { Component, OnInit, ViewChild } from '@angular/core';
import { map, Observable } from 'rxjs';
import { BoatRequirements, BoatType } from '../boat';
import { BoatService } from '../boat-service.service';
import {
  BoatTypeFilter,
  BookingService,
  LicenseFilter,
} from './booking.service';

export type BoatOverviewData = {
  id: number;
  imageRoute: string;
  name: string;
  requirements: BoatRequirements;
  boatType: BoatType;
  maxOccupants: number;
};

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.scss'],
})
export class RentalComponent implements OnInit {
  public boats: BoatOverviewData[] = [];

  constructor(private bookingService: BookingService) {}

  ngOnInit(): void {
    this.getBoats();
  }

  /**
   * Subscribe to bookingService.boats
   */
  private getBoats(): void {
    this.bookingService.getBoats().subscribe((boats: BoatOverviewData[]) => {
      this.boats = boats;
    });
  }

  /**
   * Clear all filters
   */
  public clearFilters(): void {
    this.bookingService.reset();
  }

  /**
   * @param boat boat to check
   * @returns Whether or not a boat is enabled.
   */
  public isEnabled(boat: BoatOverviewData): Observable<boolean> {
    return this.bookingService.isEnabled(boat);
  }
}
