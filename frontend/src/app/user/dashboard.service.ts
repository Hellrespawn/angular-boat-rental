import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Rental } from '../rental';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  constructor(private httpClient: HttpClient) {}

  /**
   * Retrieves the current user's next rental from the backend.
   */
  public getNextRental(): Observable<Rental | null> {
    return this.httpClient
      .get<{ rental: Rental | null }>('/api/users/rentals/next')
      .pipe(
        map(({ rental }) => {
          if (rental) {
            rental.boat.imageRoute = '/api' + rental.boat.imageRoute;
            rental.dateStart = new Date(rental.dateStart);
            rental.dateEnd = new Date(rental.dateEnd);
          }
          return rental;
        })
      );
  }
}
