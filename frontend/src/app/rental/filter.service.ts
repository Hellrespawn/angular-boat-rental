import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type BoatTypeFilter = 'all' | 'sailboat' | 'motorboat';
export type DateFilter = [Date, Date] | null;
export type LicenseFilter = 'both' | 'required' | 'not-required';

@Injectable({
  providedIn: 'root',
})
export class FilterService {
  constructor() {}

  private typeFilter: BehaviorSubject<BoatTypeFilter> = new BehaviorSubject(
    'all' as BoatTypeFilter
  );
  private dateFilter: BehaviorSubject<DateFilter> = new BehaviorSubject(
    null as DateFilter
  );
  private licenseFilter: BehaviorSubject<LicenseFilter> = new BehaviorSubject(
    'both' as LicenseFilter
  );

  public getTypeFilter(): BehaviorSubject<BoatTypeFilter> {
    return this.typeFilter;
  }

  public getDateFilter(): BehaviorSubject<DateFilter> {
    return this.dateFilter;
  }

  public getLicenseFilter(): BehaviorSubject<LicenseFilter> {
    return this.licenseFilter;
  }

  public setTypeFilter(filter: BoatTypeFilter): void {
    this.typeFilter.next(filter);
  }

  public setDateFilter(filter: DateFilter): void {
    this.dateFilter.next(filter);
  }

  public setLicenseFilter(filter: LicenseFilter): void {
    this.licenseFilter.next(filter);
  }
}
