import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import {
  Boat,
  BoatDetailData,
  BoatOverviewData,
  BoatRequirements,
} from './boat';
import { constructUrl } from './http';
import { DateRange } from './rental.service';

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
        return 'Zelf varen';

      case 'license':
        return 'Vaarbewijs vereist';

      case 'skipper':
        return 'Schipper vereist';

      default:
        throw `Invalid boat.requirements: ${item.requirements}`;
    }
  }

  /**
   * sends a request to the backend to add a new boat to the database
   * @param boatObject the object specifying the new boat
   * @returns and Observable of either the newly added boat or an error object
   */
  public addBoat(boatObject: {}): Observable<void> {
    return this.httpClient.post<void>(`/api/boats`, boatObject);
  }

  /**
   * sends a request to the backend to fetch all Boats from the database
   * @returns an Observable of an array of all Boats in the database
   */
  public getBoats(): Observable<{ boats: Boat[] }> {
    return this.httpClient.get<{ boats: Boat[] }>(`/api/boats`);
  }

  /**
   * sends a request to the backend to delete a specific boat
   * @param id the id of the boat that needs to be deleted
   * @returns an Observable of the response object
   */
  public deleteBoatById(id: number): Observable<void> {
    return this.httpClient.delete<void>(`/api/boats/${id}`);
  }
  /**
   * sends a request to the backend to update the maintenance boolean value of a specific boat
   * @param id the id of the specific boat
   * @param updatedValue the new value of the maintenance boolean of the specific boat
   * @returns an Observable of the response object
   */
  public updateMaintenanceStatus(
    id: number,
    updatedValue: boolean
  ): Observable<void> {
    return this.httpClient.patch<void>(`/api/boats`, {
      id,
      updatedValue,
    });
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
    item.imageRoute = constructUrl(item.imageRoute);
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
      .get<{ boats: BoatOverviewData[] }>(constructUrl(route))
      .pipe(map(({ boats }) => boats.map(this.modifyImageRoute.bind(this))));
  }

  /**
   * Retrieves detailed data from the backend for boat ${id}
   */
  public getBoatDetailData(id: number): Observable<BoatDetailData> {
    return this.httpClient
      .get<{ boat: BoatDetailData }>(constructUrl(`/boats/${id}/detail`))
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
      .get<{ dates: string[] }>(constructUrl(`/boats/${id}/bookedDates`))
      .pipe(
        map(({ dates }) => dates.map((dateString) => new Date(dateString)))
      );
  }
}
