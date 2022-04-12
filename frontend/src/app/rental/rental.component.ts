import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { BoatRequirements, BoatType } from '../boat';
import { BoatService } from '../boat-service.service';
import { BoatTypeFilter } from './filters/boat-type/boat-type.component';
import { LicenseFilter } from './filters/license/license.component';

export type BoatOverviewData = {
  imageRoute: string;
  name: string;
  requirements: BoatRequirements;
  boatType: BoatType;
  maxOccupants: number;
};

export type OverviewBoat = BoatOverviewData & {
  filters: {
    typeFiltered: boolean;
    licenseFiltered: boolean;
  };
};

@Component({
  selector: 'app-rental',
  templateUrl: './rental.component.html',
  styleUrls: ['./rental.component.scss'],
})
export class RentalComponent implements OnInit {
  public boats: OverviewBoat[] = [];

  constructor(private boatService: BoatService) {}

  ngOnInit(): void {
    this.getBoats();
  }

  private getBoats() {
    this.boatService
      .getBoatOverviewData()
      .pipe(
        map((boats) =>
          boats.map((boat) => {
            boat.imageRoute = `${environment.backendUrl}${boat.imageRoute}`;
            return {
              ...boat,
              filters: { typeFiltered: true, licenseFiltered: true },
            };
          })
        )
      )
      .subscribe(
        (boats: OverviewBoat[]): OverviewBoat[] => (this.boats = boats)
      );
  }

  public typeFilterChanged(change: BoatTypeFilter): void {
    for (const boat of this.boats) {
      switch (change) {
        case 'all':
          boat.filters.typeFiltered = true;
          break;
        case 'motorboat':
          boat.filters.typeFiltered = boat.boatType == 'motor';
          break;
        case 'sailboat':
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
}
