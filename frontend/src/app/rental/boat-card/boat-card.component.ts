import { Component, Input } from '@angular/core';
import { BoatRequirements } from 'src/app/boat';
import { BoatOverviewData } from '../rental.component';

const PLACEHOLDER = {
  enabled: true,
  boatType: 'motor',
  imageRoute: '/assets/notfound.jpg',
  name: 'placeholder',
  requirements: BoatRequirements.None,
  maxOccupants: 6,
};

@Component({
  selector: 'app-rental-boat-card',
  templateUrl: './boat-card.component.html',
  styleUrls: ['./boat-card.component.scss'],
})
export class BoatCardComponent {
  @Input() public boat: BoatOverviewData = PLACEHOLDER;

  public requirementsToString(): string {
    switch (this.boat.requirements) {
      case BoatRequirements.None:
        return 'Zelf varen';

      case BoatRequirements.License:
        return 'Vaarbewijs vereist';

      case BoatRequirements.Skipper:
        return 'Schipper vereist';
    }
  }

  constructor() {}
}
