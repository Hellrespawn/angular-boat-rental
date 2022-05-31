import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { BoatOverviewData } from '../boat';
import { BookingService } from './booking.service';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.scss'],
})
export class BookingComponent implements OnInit {
  public boats: BoatOverviewData[] = [];

  constructor(private bookingService: BookingService) {}

  ngOnInit(): void {
    this.getBoats();
  }

  /**
   * Subscribe to bookingService.boats
   */
  private getBoats(): void {
    this.bookingService.updateBoats();
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
