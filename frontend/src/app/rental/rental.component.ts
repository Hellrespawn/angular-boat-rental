import { Component, OnInit } from '@angular/core';
import { BoatRequirements } from '../boat';

@Component({
  selector: 'app-rental',
  templateUrl: './rental.component.html',
  styleUrls: ['./rental.component.scss'],
})
export class RentalComponent {
  public boats: BoatOverviewData[] = [
    {
      imageUrl: '/assets/rental/motorboot-placeholder.jpg',
      name: 'Boot 1',
      requirements: BoatRequirements.License,
      maxOccupants: 3,
    },
    {
      imageUrl: '/assets/rental/zeilboot-placeholder.jpg',
      name: 'Boot 2',
      requirements: BoatRequirements.None,
      maxOccupants: 6,
    },
    {
      imageUrl: '/assets/rental/motorboot-placeholder.jpg',
      name: 'Boot 3',
      requirements: BoatRequirements.Skipper,
      maxOccupants: 5,
    },
    {
      imageUrl: '/assets/rental/zeilboot-placeholder.jpg',
      name: 'Boot 4',
      requirements: BoatRequirements.License,
      maxOccupants: 4,
    },
  ];

  constructor() {}
}

export interface BoatOverviewData {
  imageUrl: string;
  name: string;
  requirements: BoatRequirements;
  maxOccupants: number;
}
