import { Component, Input } from '@angular/core';
import { BoatOverviewData } from '../../rental.component';

@Component({
  selector: 'app-boat-details',
  templateUrl: './boat-details.component.html',
  styleUrls: ['./boat-details.component.scss'],
})
export class BoatDetailsComponent {
  @Input() public boat!: BoatOverviewData;

  constructor() {}
}
