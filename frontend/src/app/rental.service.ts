import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { constructUrl } from './http';
import { Rental } from './rental';

import { SessionService } from './session.service';

export type DateRange = [Date, Date];

@Injectable({
  providedIn: 'root',
})
export class RentalService {
  constructor(private httpClient: HttpClient) {}

  /**
   * Creates a rental and returns an observable with the id of the created
   * Rental
   */
  public createRental(
    boatId: number,
    dateRange: DateRange
  ): Observable<number> {
    const [dateStart, dateEnd] = dateRange;

    let observable = this.httpClient
      .post<{ id: number }>('/api/rentals', {
        boatId,
        dateStart: dateStart,
        dateEnd: dateEnd,
      })
      .pipe(map(({ id }) => id));

    return observable;
  }

  /**
   * Retrieves the current user's next rental from the backend.
   */
  public getNextRental(): Observable<Rental | null> {
    return this.httpClient
      .get<{ rental: Rental | null }>('/api/users/rentals/next')
      .pipe(
        map(({ rental }) => {
          if (rental) {
            rental.boat.imageRoute = constructUrl(rental.boat.imageRoute);
            rental.dateStart = new Date(rental.dateStart);
            rental.dateEnd = new Date(rental.dateEnd);
          }
          return rental;
        })
      );
  }
}
