import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
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
      .post<{ id: number }>(`${environment.backendUrl}/rentals/`, {
        boatId,
        userId,
        dateStart: dateStart,
        dateEnd: dateEnd,
      })
      .pipe(map(({ id }) => id));

    return observable;
  }

  public getNextRental(customerId: number): Observable<Rental | null> {
    let observable = this.httpClient
      .get<{ rental: Rental | null }>(
        `${environment.backendUrl}/users/${customerId}/rentals/next`
      )
      .pipe(map(({ rental }) => rental));

    return observable;
  }
}
