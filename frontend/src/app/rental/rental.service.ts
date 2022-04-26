import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, map, merge, Observable } from 'rxjs';
import { BoatType } from '../boat';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { BoatOverviewData } from './rental.component';
import { BoatDetailData } from './boat-card/boat-details/boat-details.component';

type BoatOverviewResponse = { boats: BoatOverviewData[] };
type BoatDetailResponse = { boat: BoatDetailData };

export type BoatTypeFilter = 'all' | BoatType;
export type LicenseFilter = 'both' | 'required' | 'not-required';

@Injectable({
  providedIn: 'root',
})
export class RentalService {
  public boats: BehaviorSubject<BoatOverviewData[]> = new BehaviorSubject(
    [] as BoatOverviewData[]
  );

  public dateRange: BehaviorSubject<[Date, Date] | null> = new BehaviorSubject(
    null as [Date, Date] | null
  );

  public typeFilter: BehaviorSubject<BoatTypeFilter> = new BehaviorSubject(
    'all' as BoatTypeFilter
  );

  public licenseFilter: BehaviorSubject<LicenseFilter> = new BehaviorSubject(
    'both' as LicenseFilter
  );

  constructor(private httpClient: HttpClient) {
    this.updateBoatOverviewData();
  }

  /**
   * Updates the list of valid boats, based on this.dateRange, and broadcasts
   * it to subscribers of this.boats
   */
  public updateBoatOverviewData(): void {
    this.dateRange.subscribe((dateRange) => {
      let route = '/boats/overview';

      if (dateRange) {
        let [startDate, endDate] = dateRange;

        route += `/available/${this.dateToYMD(startDate)}/${this.dateToYMD(
          endDate
        )}`;
      }

      this.httpClient
        .get<BoatOverviewResponse>(this.constructUrl(route))
        .subscribe(({ boats }) =>
          this.boats.next(boats.map(this.modifyImageRoute.bind(this)))
        );
    });
  }

  /**
   * Returns an observable which tells whether or not a boat passes
   * the license filter.
   */
  private passesLicenseFilter(boat: BoatOverviewData): Observable<boolean> {
    return this.licenseFilter.pipe(
      map((licenseFilter) => {
        switch (licenseFilter) {
          case 'both':
            return true;
          case 'required':
            return boat.requirements == 'license';
          case 'not-required':
            return boat.requirements == 'none';
        }
      })
    );
  }
  /**
   * Returns an observable which tells whether or not a boat passes
   * the boat type filter.
   */
  private passesTypeFilter(boat: BoatOverviewData): Observable<boolean> {
    return this.typeFilter.pipe(
      map((typeFilter) => {
        switch (typeFilter) {
          case 'all':
            return true;

          case 'motor':
            return boat.boatType == 'motor';

          case 'sail':
            return boat.boatType == 'sail';
        }
      })
    );
  }

  /** Resets all current filters. */
  public reset(): void {
    this.licenseFilter.next('both');
    this.typeFilter.next('all');
    this.dateRange.next(null);
  }

  /**
   * Appends relative route to backend URL. Requires leading '/'.
   *
   * @param url
   * @returns complete url
   */
  private constructUrl(url: string): string {
    return `${environment.backendUrl}${url}`;
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
    item.imageRoute = this.constructUrl(item.imageRoute);
    return item;
  }

  /**
   * Formats Date object as YYYY-MM-DD
   */
  private dateToYMD(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  /**
   * Retrieves detailed data from the backend for boat ${id}
   */
  public getBoatDetailData(id: number): Observable<BoatDetailData> {
    return this.httpClient
      .get<BoatDetailResponse>(this.constructUrl(`/boats/${id}/detail`))
      .pipe(
        // Destructure object in parameter list.
        map(({ boat }: BoatDetailResponse): BoatDetailData => {
          return this.modifyImageRoute(boat);
        })
      );
  }

  /**
   * Returns a list of all booked dates for boat ${id}
   */
  public getBookedDates(id: number): Observable<Date[]> {
    return this.httpClient
      .get<{ dates: string[] }>(this.constructUrl(`/boats/${id}/bookedDates`))
      .pipe(
        map(({ dates }) => dates.map((dateString) => new Date(dateString)))
      );
  }

  /**
   * Creates a rental and returns an observable with the id of the created
   * Rental
   */
  public addRental(boatId: number, customerId: number): Observable<number> {
    const [dateStart, dateEnd] = this.dateRange.getValue()!;

    let observable = this.httpClient
      .post<{ id: number }>(`${environment.backendUrl}/rentals/`, {
        boatId,
        customerId,
        dateStart: dateStart,
        dateEnd: dateEnd,
      })
      .pipe(map(({ id }) => id));

    this.reset();

    return observable;
  }

  /**
   * Returns an observable which tells whether or not the boat passes the
   * filters
   */
  public isEnabled(boat: BoatOverviewData): Observable<boolean> {
    return combineLatest([
      this.passesLicenseFilter(boat),
      this.passesTypeFilter(boat),
    ]).pipe(map((filters) => filters.every((filter) => filter)));
  }

  /**
   * Gets the amount of days between two dates.
   */
  public getDays(dateStart: Date, dateEnd: Date): number {
    let ms = dateEnd!.getTime() - dateStart!.getTime();
    let days = ms / 1000 / 60 / 60 / 24;
    return days + 1;
  }

  /**
   * Checks whether or not the date range is valid.
   */
  public isRangeValid(dateStart: Date, dateEnd: Date): boolean {
    return this.getDays(dateStart, dateEnd) >= 3;
  }
}
