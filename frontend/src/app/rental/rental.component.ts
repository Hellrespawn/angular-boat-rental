import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { BoatRequirements, BoatType } from '../boat';
import { BoatService } from '../boat-service.service';
import { BoatTypeFilter } from './filters/boat-type/boat-type.component';
import { FilterType } from './filters/filters.component';

export type BoatOverviewData = {
  imageRoute: string;
  name: string;
  requirements: BoatRequirements;
  boatType: BoatType;
  maxOccupants: number;
};

export type OverviewBoat = BoatOverviewData & { enabled: boolean };

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
            return { ...boat, enabled: true };
          })
        )
      )
      .subscribe((boats) => (this.boats = this.filterBoats(boats)));
  }

  public filtersChanged(change: [FilterType, string]): void {
    this.filterBoats(this.boats, change);
  }

  private filterBoats(
    boats: OverviewBoat[],
    change?: [FilterType, string]
  ): OverviewBoat[] {
    if (change) {
      const [filter, value] = change;
      if (filter === 'boat-type') {
        // FIXME Make this neater.
        this.filterBoatType(boats, value as BoatTypeFilter);
      }
    }

    return boats;
  }

  private filterBoatType(
    boats: OverviewBoat[],
    value: BoatTypeFilter
  ): OverviewBoat[] {
    for (let boat of boats) {
      switch (value) {
        case 'all':
          boat.enabled = true;
          break;
        case 'motorboat':
          boat.enabled = boat.boatType == 'motor';
          break;
        case 'sailboat':
          boat.enabled = boat.boatType == 'sail';
          break;
      }
    }

    return boats;
  }
}
