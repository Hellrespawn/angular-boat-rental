import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

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
    customerId: number,
    dateRange: DateRange
  ): Observable<number> {
    const [dateStart, dateEnd] = dateRange;

    let observable = this.httpClient
      .post<{ id: number }>(`${environment.backendUrl}/rentals/`, {
        boatId,
        customerId,
        dateStart: dateStart,
        dateEnd: dateEnd,
      })
      .pipe(map(({ id }) => id));

    return observable;
  }
}
