import { Component, Input } from '@angular/core';
import { BoatRequirements, BoatType } from 'src/app/boat';
import { BoatOverviewData } from '../rental.component';

@Component({
  selector: 'app-rental-boat-card',
  templateUrl: './boat-card.component.html',
  styleUrls: ['./boat-card.component.scss'],
})
export class BoatCardComponent {
  @Input() public boat!: BoatOverviewData;
  @Input() public enabled!: boolean;

  public requirementsToString(): string {
    switch (this.boat.requirements) {
      case 'none':
        return 'Zelf varen';

      case 'license':
        return 'Vaarbewijs vereist';

      case 'skipper':
        return 'Schipper vereist';

      default:
        throw `Invalid boat.requirements: ${this.boat.requirements}`;
    }
  }

  constructor() {}
}
