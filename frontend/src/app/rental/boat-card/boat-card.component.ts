import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BoatOverviewData } from '../rental.component';
import { BoatDetailsComponent } from './boat-details/boat-details.component';

@Component({
  selector: 'app-rental-boat-card',
  templateUrl: './boat-card.component.html',
  styleUrls: ['./boat-card.component.scss'],
})
export class BoatCardComponent {
  @Input() public boat!: BoatOverviewData;
  @Input() public enabled!: boolean;

  constructor(private dialog: MatDialog) {}

  public openDialog(): void {
    const dialogRef = this.dialog.open(BoatDetailsComponent, {});
  }

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
}
