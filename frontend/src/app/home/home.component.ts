import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BookingService } from '../booking/booking.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  constructor(private bookingService: BookingService, private router: Router) {}

  public canalCallback(): void {
    this.bookingService.reset();
    this.bookingService.setTypeFilter('motor');
    this.router.navigate(['/rent']);
  }

  public partyBoatCallback(): void {
    this.bookingService.reset();
    this.bookingService.setTypeFilter('motor');
    this.bookingService.setLicenseFilter('required');
    this.router.navigate(['/rent']);
  }

  public sailboatCallback(): void {
    this.bookingService.reset();
    this.bookingService.setTypeFilter('sail');
    this.router.navigate(['/rent']);
  }
}
