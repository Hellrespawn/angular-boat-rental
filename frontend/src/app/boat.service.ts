import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { BoatDetailData, BoatOverviewData, BoatRequirements } from './boat';
import { DateRange } from './date';

@Injectable({
  providedIn: 'root',
})
export class BoatService {
  constructor(private httpClient: HttpClient) {}

  /**
   * Creates a string to display from BoatRequirements
   * @returns
   */
  public requirementsToString<T extends { requirements: BoatRequirements }>(
    item: T
  ): string {
    switch (item.requirements) {
      case 'none':
        return 'No license';

      case 'license':
        return 'License required';

      default:
        throw `Invalid boat.requirements: ${item.requirements}`;
    }
  }

  /**
   * Adds the address of the backend to the imageRoute received from the
   * backend.
   *
   * Will work on any type T that has a property imageRoute: string.
   *
   * @param item
   * @returns modified item.
   */
  private modifyImageRoute<T extends { imageRoute: string }>(item: T): T {
    item.imageRoute = '/api' + item.imageRoute;
    return item;
  }

  /**
   * Formats Date object as YYYY-MM-DD
   */
  private dateToYMD(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  /**
   * Gets BoatOverviewData for all boats. Optionally restrict it to dateRange
   *
   * @param dateRange
   * @returns Array of BoatOverviewData
   */
  public getBoatOverviewData(
    dateRange?: DateRange
  ): Observable<BoatOverviewData[]> {
    let route = '/boats/overview';

    if (dateRange) {
      let { dateStart, dateEnd } = dateRange;

      route += `/available/${this.dateToYMD(dateStart)}/${this.dateToYMD(
        dateEnd
      )}`;
    }

    return this.httpClient
      .get<{ boats: BoatOverviewData[] }>('/api' + route)
      .pipe(map(({ boats }) => boats.map(this.modifyImageRoute.bind(this))));
  }

  /**
   * Retrieves detailed data from the backend for boat ${id}
   */
  public getBoatDetailData(id: number): Observable<BoatDetailData> {
    return this.httpClient
      .get<{ boat: BoatDetailData }>(`/api/boats/${id}/detail`)
      .pipe(
        // Destructure object in parameter list.
        map(({ boat }): BoatDetailData => {
          return this.modifyImageRoute(boat);
        })
      );
  }

  /**
   * Returns a list of all booked dates for boat ${id}
   */
  public getBookedDates(id: number): Observable<Date[]> {
    return this.httpClient
      .get<{ dates: string[] }>(`/api/boats/${id}/bookedDates`)
      .pipe(
        map(({ dates }) => dates.map((dateString) => new Date(dateString)))
      );
  }
}
