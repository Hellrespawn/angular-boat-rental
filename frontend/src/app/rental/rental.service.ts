import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { BoatType } from '../boat';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

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
  private previousDateStart: Date | null = null;
  private _dateStart: BehaviorSubject<Date | null> = new BehaviorSubject(
    null as Date | null
  );
  private _dateEnd: BehaviorSubject<Date | null> = new BehaviorSubject(
    null as Date | null
  );

  private _typeFilter: BehaviorSubject<BoatTypeFilter> = new BehaviorSubject(
    'all' as BoatTypeFilter
  );

  private _licenseFilter: BehaviorSubject<LicenseFilter> = new BehaviorSubject(
    'both' as LicenseFilter
  );

  constructor(private httpClient: HttpClient) {
    this.initId();
    this.initDateStart();
    this.initDateEnd();
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

  private initDateStart(): void {
    let dateString = localStorage.getItem(RentalService.storageKeys.dateStart);

    if (dateString) {
      this._dateStart.next(new Date(dateString));
    }
  }

  private initDateEnd(): void {
    let dateString = localStorage.getItem(RentalService.storageKeys.dateEnd);

    if (dateString) {
      this._dateEnd.next(new Date(dateString));
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

  private updateDateFilter(): void {
    // Reset endDate if startDate changed.
    if (this.dateStart != this.previousDateStart) {
      this._dateEnd.next(null);
      this.previousDateStart = this.dateStart;
      localStorage.removeItem(RentalService.storageKeys.dateStart);
      localStorage.removeItem(RentalService.storageKeys.dateEnd);
    }

    // Only emit event if both are filled in
    if (this.dateStart && this.dateEnd) {
      localStorage.setItem(
        RentalService.storageKeys.dateStart,
        this.dateStart.toISOString()
      );
      localStorage.setItem(
        RentalService.storageKeys.dateEnd,
        this.dateEnd.toISOString()
      );
    }
  }

  public reset(): void {
    this.selectedBoatId = undefined;
    this.licenseFilter = 'both';
    this.dateStart = null;
    this.dateEnd = null;
    this.previousDateStart = null;
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

  public get licenseFilterSubject(): BehaviorSubject<LicenseFilter> {
    return this._licenseFilter;
  }

  public get dateStartSubject(): BehaviorSubject<Date | null> {
    return this._dateStart;
  }

  public get dateEndSubject(): BehaviorSubject<Date | null> {
    return this._dateEnd;
  }

  public get typeFilter(): BoatTypeFilter {
    return this._typeFilter.getValue();
  }

  public get licenseFilter(): LicenseFilter {
    return this._licenseFilter.getValue();
  }

  public set typeFilter(filter: BoatTypeFilter) {
    this._typeFilter.next(filter);
    localStorage.setItem(RentalService.storageKeys.type, filter);
  }

  public set licenseFilter(filter: LicenseFilter) {
    this._licenseFilter.next(filter);
    localStorage.setItem(RentalService.storageKeys.license, filter);
  }

  public set dateStart(date: Date | null) {
    this._dateStart.next(date);
    this.updateDateFilter();
  }

  public get dateStart(): Date | null {
    return this._dateStart.getValue();
  }

  public set dateEnd(date: Date | null) {
    this._dateEnd.next(date);
    this.updateDateFilter();
  }

  public get dateEnd(): Date | null {
    return this._dateEnd.getValue();
  }

  public getDates(): [Date, Date] | null {
    if (this.dateStart && this.dateEnd) {
      return [this.dateStart, this.dateEnd];
    } else {
      return null;
    }
  }

  public addRental(customerId: number): Observable<number> {
    return this.httpClient
      .post<{ id: number }>(`${environment.backendUrl}/rental/`, {
        boatId: this.selectedBoatId,
        customerId,
        dateStart: this.dateStart,
        dateEnd: this.dateEnd,
      })
      .pipe(map(({ id }) => id));
  }
}
