import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs';
import { BoatRequirements, BoatType } from '../boat';
import { BoatService } from '../boat-service.service';
import {
  BoatTypeFilter,
  DateFilter,
  RentalService,
  LicenseFilter,
} from './rental.service';

export type BoatOverviewData = {
  id: number;
  imageRoute: string;
  name: string;
  requirements: BoatRequirements;
  boatType: BoatType;
  maxOccupants: number;
};

export type BoatOverviewFilters = {
  filters: {
    typeFiltered: boolean;
    licenseFiltered: boolean;
  };
};

export type OverviewBoat = BoatOverviewData & BoatOverviewFilters;

@Component({
  selector: 'app-rental',
  templateUrl: './rental.component.html',
  styleUrls: ['./rental.component.scss'],
})
export class RentalComponent implements OnInit {
  public boats: OverviewBoat[] = [];

  constructor(
    private boatService: BoatService,
    private rentalService: RentalService
  ) {}

  ngOnInit(): void {
    this.getBoats();
    this.subscribeToFilters();
  }

  private getBoats(dateRange?: [Date, Date]): void {
    this.boatService
      .getBoatOverviewData(dateRange)
      .pipe(
        map((boats: BoatOverviewData[]): OverviewBoat[] =>
          boats.map((boat: BoatOverviewData): OverviewBoat => {
            return {
              ...boat,
              filters: { typeFiltered: true, licenseFiltered: true },
            };
          })
        )
      )
      .subscribe((boats: OverviewBoat[]): OverviewBoat[] => {
        this.boats = boats;
        this.typeFilterChanged(this.rentalService.typeFilter);
        this.licenseFilterChanged(this.rentalService.licenseFilter);
        return this.boats;
      });
  }

  private subscribeToFilters(): void {
    this.rentalService.dateFilterSubject.subscribe(
      this.dateFilterChanged.bind(this)
    );

    this.rentalService.licenseFilterSubject.subscribe(
      this.licenseFilterChanged.bind(this)
    );

    this.rentalService.typeFilterSubject.subscribe(
      this.typeFilterChanged.bind(this)
    );
  }

  public enabled(boat: OverviewBoat): boolean {
    return Object.values(boat.filters).every((v) => v);
  }

  public typeFilterChanged(change: BoatTypeFilter): void {
    for (const boat of this.boats) {
      switch (change) {
        case 'all':
          boat.filters.typeFiltered = true;
          break;
        case 'motor':
          boat.filters.typeFiltered = boat.boatType == 'motor';
          break;
        case 'sail':
          boat.filters.typeFiltered = boat.boatType == 'sail';
          break;
      }
    }
  }

  public licenseFilterChanged(change: LicenseFilter): void {
    for (const boat of this.boats) {
      switch (change) {
        case 'both':
          boat.filters.licenseFiltered = true;
          break;
        case 'required':
          boat.filters.licenseFiltered = boat.requirements == 'license';
          break;
        case 'not-required':
          boat.filters.licenseFiltered = boat.requirements == 'none';
          break;
      }
    }
  }

  public dateFilterChanged(change: DateFilter | null): void {
    if (change) {
      this.getBoats(change);
    }
  }
}
