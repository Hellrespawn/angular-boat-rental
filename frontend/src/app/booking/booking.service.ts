import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  combineLatest,
  map,
  Observable,
  Subscription,
  tap,
} from 'rxjs';
import { type BoatOverviewData } from 'auas-common';
import { BoatService } from '../boat.service';
import { DateRange } from '../date';
import { MINIMUM_RENTAL } from '../rental';
import { SessionService } from '../session.service';
import {
  BoatTypeFilter,
  BoatTypeFilterState,
} from './filters/boat-type/boat-type.component';
import { BookingFilter } from './filters/filter';
import {
  LicenseFilter,
  LicenseFilterState,
} from './filters/license/license.component';

export type BookingServiceBoat = BoatOverviewData & { enabled: boolean };

@Injectable({
  providedIn: 'root',
})
export class BookingService {
  // Boats
  protected boats: BehaviorSubject<BookingServiceBoat[]> = new BehaviorSubject(
    [] as BookingServiceBoat[]
  );
  private boatSubscription?: Subscription;

  // Filters
  private dateRange: BehaviorSubject<DateRange | null> = new BehaviorSubject(
    null as DateRange | null
  );

  protected typeFilter: BehaviorSubject<BoatTypeFilterState> =
    new BehaviorSubject('all' as BoatTypeFilterState);

  protected licenseFilter: BehaviorSubject<LicenseFilterState> =
    new BehaviorSubject('both' as LicenseFilterState);

  constructor(
    private httpClient: HttpClient,
    private boatService: BoatService,
    private sessionService: SessionService
  ) {
    this.getCurrentUserLicense();
    this.updateBoats();
  }

  // Getters and setters
  public getDateRange(): Observable<DateRange | null> {
    return this.dateRange.asObservable();
  }

  public setDateRange(dateRange: DateRange | null): void {
    this.dateRange.next(dateRange);
    this.updateBoats();
  }

  public clearDateRange(): void {
    this.dateRange.next(null);
  }

  public getTypeFilter(): Observable<BoatTypeFilterState> {
    return this.typeFilter.asObservable();
  }

  public setTypeFilter(filter: BoatTypeFilterState): void {
    this.typeFilter.next(filter);
  }

  public clearTypeFilter(): void {
    this.setTypeFilter('all');
  }

  public getLicenseFilter(): Observable<LicenseFilterState> {
    return this.licenseFilter.asObservable();
  }

  public setLicenseFilter(filter: LicenseFilterState): void {
    this.licenseFilter.next(filter);
  }

  public clearLicenseFilter(): void {
    this.setLicenseFilter('both');
  }

  /** Resets all current filters. */
  public reset(): void {
    this.clearLicenseFilter();
    this.clearTypeFilter();
    this.clearDateRange();
    this.updateBoats();
  }

  /**
   * Returns an Observable with all boats that pass the filters.
   */
  public getBoats(): Observable<BookingServiceBoat[]> {
    return combineLatest([
      this.boats,
      this.licenseFilter,
      this.typeFilter,
    ]).pipe(
      map(([boats, license, type]) => this.filterBoats(boats, license, type))
    );
  }

  /**
   * Creates a rental and returns an observable with the id of the created
   * Rental. Resets the filter state.
   */
  public createRental(boatRegistrationNumber: number): Observable<number> {
    const dateRange = this.dateRange.getValue();

    if (!dateRange) {
      throw new Error('Called createRental() when dateRange is undefined.');
    }

    const { dateStart, dateEnd } = dateRange;

    return this.httpClient
      .post<{ orderNumber: number }>('/api/rentals', {
        boatRegistrationNumber,
        dateStart: dateStart,
        dateEnd: dateEnd,
      })
      .pipe(map(({ orderNumber }) => orderNumber))
      .pipe(tap(this.reset.bind(this)));
  }

  /**
   * Gets the amount of days between two dates.
   */
  public getDays(dateRange: DateRange): number {
    let ms = dateRange.dateEnd.getTime() - dateRange.dateStart.getTime();
    let days = ms / 1000 / 60 / 60 / 24;
    return days + 1;
  }

  /**
   * Checks whether or not the date range is valid.
   */
  public isRangeValid(dateRange: DateRange): boolean {
    return this.getDays(dateRange) >= MINIMUM_RENTAL;
  }

  /**
   * Updates the list of valid boats, based on this.dateRange, and broadcasts
   * it to subscribers of this.boats
   */
  public updateBoats(): void {
    this.boatSubscription?.unsubscribe();

    this.boatSubscription = this.dateRange.subscribe((dateRange) =>
      this.boatService
        .getOverviewData(dateRange ?? undefined)
        .subscribe((boats) =>
          this.boats.next(
            boats.map((boat) => {
              return { ...boat, enabled: false };
            })
          )
        )
    );
  }

  /**
   * Observes currentUserData and sets the license filter based on it.
   */
  protected getCurrentUserLicense(): void {
    this.sessionService.getSessionData().subscribe((sessionData) => {
      if (sessionData && !sessionData.license) {
        this.licenseFilter.next('not-required');
      } else if (!sessionData) {
        this.reset();
      }
    });
  }

  /**
   * Applies all filters to this.boats.
   */
  private filterBoats(
    boats: BookingServiceBoat[],
    license: LicenseFilterState,
    type: BoatTypeFilterState
  ): BookingServiceBoat[] {
    const filters: BookingFilter[] = [
      new LicenseFilter(license),
      new BoatTypeFilter(type),
    ];

    boats.forEach(
      (boat) => (boat.enabled = filters.every((filter) => filter.apply(boat)))
    );

    return boats;
  }
}
