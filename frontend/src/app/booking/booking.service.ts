import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, map, merge, Observable } from 'rxjs';
import { BoatType } from '../boat';
import { BoatOverviewData } from './booking.component';
import { BoatService } from '../boat-service.service';
import { DateRange, RentalService } from '../rental.service';

export type BoatTypeFilter = 'all' | BoatType;
export type LicenseFilter = 'both' | 'required' | 'not-required';

@Injectable({
  providedIn: 'root',
})
export class BookingService {
  private boats: BehaviorSubject<BoatOverviewData[]> = new BehaviorSubject(
    [] as BoatOverviewData[]
  );

  private dateRange: BehaviorSubject<DateRange | null> = new BehaviorSubject(
    null as DateRange | null
  );

  private typeFilter: BehaviorSubject<BoatTypeFilter> = new BehaviorSubject(
    'all' as BoatTypeFilter
  );

  private licenseFilter: BehaviorSubject<LicenseFilter> = new BehaviorSubject(
    'both' as LicenseFilter
  );

  constructor(
    private boatService: BoatService,
    private rentalService: RentalService
  ) {
    this.updateBoatOverviewData();
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

  // Getters and setters
  public getBoats(): Observable<BoatOverviewData[]> {
    return this.boats;
  }

  public getDateRange(): Observable<DateRange | null> {
    return this.dateRange;
  }

  public setDateRange(dateRange: DateRange | null): void {
    this.dateRange.next(dateRange);
  }

  public clearDateRange(): void {
    this.dateRange.next(null);
  }

  public getTypeFilter(): Observable<BoatTypeFilter> {
    return this.typeFilter;
  }

  public setTypeFilter(filter: BoatTypeFilter): void {
    this.typeFilter.next(filter);
  }

  public clearTypeFilter(): void {
    this.setTypeFilter('all');
  }

  public getLicenseFilter(): Observable<LicenseFilter> {
    return this.licenseFilter;
  }

  public setLicenseFilter(filter: LicenseFilter): void {
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
  }

  /**
   * Updates the list of valid boats, based on this.dateRange, and broadcasts
   * it to subscribers of this.boats
   */
  public updateBoatOverviewData(): void {
    this.boatService
      .getBoatOverviewData()
      .subscribe((boats) => this.boats.next(boats));
  }

  /**
   * Creates a rental and returns an observable with the id of the created
   * Rental
   */
  public createRental(boatId: number, customerId: number): Observable<number> {
    let observable = this.rentalService.createRental(
      boatId,
      customerId,
      this.dateRange.getValue()!
    );

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
