import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { type BoatDetailData } from 'auas-common';
import { BoatService } from 'src/app/boat.service';

@Component({
  selector: 'app-boat-details',
  templateUrl: './boat-details.component.html',
  styleUrls: ['./boat-details.component.scss'],
})
export class BoatDetailsComponent implements OnInit {
  public boat!: BoatDetailData;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { registrationNumber: number },
    private boatService: BoatService
  ) {}

  ngOnInit(): void {
    this.getBoat();
  }

  private getBoat(): void {
    this.boatService
      .getDetailData(this.data.registrationNumber)
      .subscribe((boat) => (this.boat = boat));
  }

  public requirementsToString(): string {
    return this.boatService.requirementsToString(this.boat);
  }
}
