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
   * Subscribe to boats in BookingService.
   */
  private getBoats(): void {
    this.bookingService.getBoats().subscribe((boats: BoatOverviewData[]) => {
      this.boats = boats;
    });
  }
}
