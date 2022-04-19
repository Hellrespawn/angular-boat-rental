import { Component } from '@angular/core';
import { BoatTypeFilter, FilterService } from '../../filter.service';

@Component({
  selector: 'app-filters-boat-type',
  templateUrl: './boat-type.component.html',
  styleUrls: ['./boat-type.component.scss'],
})
export class BoatTypeComponent {
  public selectedOption: BoatTypeFilter = 'all';

  public changeFilter(): void {
    this.filterService.setTypeFilter(this.selectedOption);
  }

  constructor(private filterService: FilterService) {}
}
