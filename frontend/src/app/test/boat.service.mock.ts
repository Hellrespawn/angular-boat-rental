import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Boat } from '../boat';
import { BoatService } from '../boat.service';

@Injectable({
  providedIn: 'root',
})
export class MockBoatService extends BoatService {
  public override addBoat(boatObject: {}): Observable<void> {
    return of(void 0);
  }

  public override getBoats(): Observable<{ boats: Boat[] }> {
    return of({
      boats: [
        {
          id: 1,
          name: 'De Test Boot',
          registrationNumber: 123,
          pricePerDay: 250,
          skipperRequired: true,
          maintenance: false,
          imageRoute: 'test',
          lengthInM: 20,
          maxOccupants: 10,
          boatType: 'motor',
          maxSpeedInKmH: 100,
        },
      ],
    });
  }

  public override deleteBoatById(id: number): Observable<void> {
    return of(void 0);
  }

  public override updateMaintenanceStatus(
    id: number,
    updatedValue: boolean
  ): Observable<void> {
    return of(void 0);
  }
}
