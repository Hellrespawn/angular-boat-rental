import { Component, OnInit } from '@angular/core';
import { BoatRequirements } from '../boat';
import { BoatService } from '../boat-service.service';
import { BoatTypeFilter } from './filters/boat-type/boat-type.component';
import { FilterType } from './filters/filters.component';

@Component({
  selector: 'app-rental',
  templateUrl: './rental.component.html',
  styleUrls: ['./rental.component.scss'],
})
export class RentalComponent implements OnInit {
  public boats: BoatOverviewData[] = [];

  constructor(private boatService: BoatService) {}

  ngOnInit(): void {
    this.getBoats();
  }

  private getBoats() {
    this.boatService
      .getBoatOverviewData()
      .subscribe((boats) => (this.boats = this.filterBoats(boats)));
  }

  public filtersChanged(change: [FilterType, string]): void {
    this.filterBoats(this.boats, change);
  }

  private filterBoats(
    boats: BoatOverviewData[],
    change?: [FilterType, string]
  ): BoatOverviewData[] {
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
    boats: BoatOverviewData[],
    value: BoatTypeFilter
  ): BoatOverviewData[] {
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

export interface BoatOverviewData {
  enabled: boolean;
  imageRoute: string;
  name: string;
  requirements: BoatRequirements;
  boatType: string;
  maxOccupants: number;
}
