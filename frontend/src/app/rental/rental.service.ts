import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { BoatType } from '../boat';

export type BoatTypeFilter = 'all' | BoatType;
export type DateFilter = [Date, Date] | null;
export type LicenseFilter = 'both' | 'required' | 'not-required';

@Injectable({
  providedIn: 'root',
})
export class RentalService {
  private static storageKeys = {
    id: 'selectedBoatId',
    dateStart: 'dateStart',
    dateEnd: 'dateEnd',
    license: 'license',
    type: 'boatType',
  };

  private _selectedBoatId?: number;

  private _typeFilter: BehaviorSubject<BoatTypeFilter> = new BehaviorSubject(
    'all' as BoatTypeFilter
  );

  private _dateFilter: BehaviorSubject<DateFilter> = new BehaviorSubject(
    null as DateFilter
  );

  private _licenseFilter: BehaviorSubject<LicenseFilter> = new BehaviorSubject(
    'both' as LicenseFilter
  );

  constructor() {
    this.initId();
    this.initDateFilter();
    this.initLicenseFilter();
    this.initTypeFilter();
  }

  private initId(): void {
    let id = parseInt(
      localStorage.getItem(RentalService.storageKeys.id) ?? 'NaN'
    );

    if (!isNaN(id) && id > 0) {
      this._selectedBoatId = id;
    }
  }

  private initDateFilter(): void {
    const dateStartString = localStorage.getItem(
      RentalService.storageKeys.dateStart
    );
    const dateEndString = localStorage.getItem(
      RentalService.storageKeys.dateEnd
    );

    if (dateStartString && dateEndString) {
      const dateStart = new Date(dateStartString);
      const dateEnd = new Date(dateEndString);

      this._dateFilter.next([dateStart, dateEnd] as DateFilter);
    }
  }

  private initLicenseFilter(): void {
    const license = localStorage.getItem(RentalService.storageKeys.license);

    if (license) {
      this._licenseFilter.next(license as LicenseFilter);
    }
  }

  private initTypeFilter(): void {
    const type = localStorage.getItem(RentalService.storageKeys.type);

    if (type) {
      this._typeFilter.next(type as BoatTypeFilter);
    }
  }

  public reset(): void {
    this.selectedBoatId = undefined;
    this.licenseFilter = 'both';
    this.dateFilter = null;
    this.typeFilter = 'all';
  }

  public get selectedBoatId(): number | undefined {
    return this._selectedBoatId;
  }

  public set selectedBoatId(id: number | undefined) {
    this._selectedBoatId = id;
    if (id) {
      localStorage.setItem(RentalService.storageKeys.id, id.toString());
    } else {
      localStorage.removeItem(RentalService.storageKeys.id);
    }
  }

  public get typeFilterSubject(): BehaviorSubject<BoatTypeFilter> {
    return this._typeFilter;
  }

  public get dateFilterSubject(): BehaviorSubject<DateFilter> {
    return this._dateFilter;
  }

  public get licenseFilterSubject(): BehaviorSubject<LicenseFilter> {
    return this._licenseFilter;
  }

  public get typeFilter(): BoatTypeFilter {
    return this._typeFilter.getValue();
  }

  public get dateFilter(): DateFilter {
    return this._dateFilter.getValue();
  }

  public get licenseFilter(): LicenseFilter {
    return this._licenseFilter.getValue();
  }

  public set typeFilter(filter: BoatTypeFilter) {
    this._typeFilter.next(filter);
    localStorage.setItem(RentalService.storageKeys.type, filter);
  }

  public set dateFilter(filter: DateFilter) {
    this._dateFilter.next(filter);

    if (filter) {
      const [dateStart, dateEnd] = filter;
      localStorage.setItem(
        RentalService.storageKeys.dateStart,
        dateStart.toISOString()
      );
      localStorage.setItem(
        RentalService.storageKeys.dateEnd,
        dateEnd.toISOString()
      );
    } else {
      localStorage.removeItem(RentalService.storageKeys.dateStart);
      localStorage.removeItem(RentalService.storageKeys.dateEnd);
    }
  }

  public set licenseFilter(filter: LicenseFilter) {
    this._licenseFilter.next(filter);
    localStorage.setItem(RentalService.storageKeys.license, filter);
  }
}
