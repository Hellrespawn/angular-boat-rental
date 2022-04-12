import { Component, Input } from '@angular/core';
import { BoatRequirements, BoatType } from 'src/app/boat';
import { OverviewBoat } from '../rental.component';

const PLACEHOLDER = {
  filters: {
    typeFiltered: true,
    licenseFiltered: true,
  },

  boatType: 'motor' as BoatType,
  imageRoute: '/assets/notfound.jpg',
  name: 'placeholder',
  requirements: 'none' as BoatRequirements,
  maxOccupants: 6,
};

@Component({
  selector: 'app-rental-boat-card',
  templateUrl: './boat-card.component.html',
  styleUrls: ['./boat-card.component.scss'],
})
export class BoatCardComponent {
  @Input() public boat: OverviewBoat = PLACEHOLDER;

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

  public enabled(): boolean {
    return Object.values(this.boat.filters).every((v) => v);
  }

  constructor() {}
}
