import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { constructUrl } from './http';
import { Rental } from './rental';

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
    userId: number,
    dateRange: DateRange
  ): Observable<number> {
    const [dateStart, dateEnd] = dateRange;

    let observable = this.httpClient
      .post<{ id: number }>(constructUrl('/rentals'), {
        boatId,
        userId,
        dateStart: dateStart,
        dateEnd: dateEnd,
      })
      .pipe(map(({ id }) => id));

    return observable;
  }

  public getNextRental(userId: number): Observable<Rental | null> {
    let observable = this.httpClient
      .get<{ rental: Rental | null }>(
        constructUrl(`/users/${userId}/rentals/next`)
      )
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

    return observable;
  }
}
