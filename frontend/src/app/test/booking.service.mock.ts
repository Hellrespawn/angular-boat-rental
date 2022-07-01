import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { BoatRequirements, BoatType } from '../boat';
import { BoatService } from '../boat.service';
import { BookingService } from '../booking/booking.service';
import { RentalService } from '../rental.service';
import { SessionService } from '../session.service';

export const MOCK_BOATS = [
  {
    id: 1,
    imageRoute: '',
    name: 'boot1',
    requirements: 'none' as BoatRequirements,
    boatType: 'motor' as BoatType,
    maxPassengers: 10,
    enabled: true,
  },
  {
    id: 2,
    imageRoute: '',
    name: 'boot2',
    requirements: 'license' as BoatRequirements,
    boatType: 'sail' as BoatType,
    maxPassengers: 10,
    enabled: true,
  },
  {
    id: 3,
    imageRoute: '',
    name: 'boot3',
    requirements: 'skipper' as BoatRequirements,
    boatType: 'sail' as BoatType,
    maxPassengers: 10,
    enabled: true,
  },
];

@Injectable({
  providedIn: 'root',
})
export class MockBookingService extends BookingService {
  constructor() {
    super(
      {} as unknown as BoatService,
      {} as unknown as RentalService,
      {} as unknown as SessionService
    );
  }

  protected override updateBoats(): void {
    this.boats.next(MOCK_BOATS);
  }

  public override createRental(boatId: number): Observable<number> {
    return of(-1);
  }

  protected override getCurrentUserLicense(): void {
    // Do nothing
  }
}
