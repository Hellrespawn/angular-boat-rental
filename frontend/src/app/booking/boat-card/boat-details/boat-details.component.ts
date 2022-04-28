import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BoatDetailData } from 'src/app/boat';
import { BoatService } from 'src/app/boat.service';

@Component({
  selector: 'app-boat-details',
  templateUrl: './boat-details.component.html',
  styleUrls: ['./boat-details.component.scss'],
})
export class BoatDetailsComponent implements OnInit {
  public boat!: BoatDetailData;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { id: number },
    private boatService: BoatService
  ) {}

  ngOnInit(): void {
    this.getBoat();
  }

  private getBoat(): void {
    this.boatService
      .getBoatDetailData(this.data.id)
      .subscribe((boat) => (this.boat = boat));
  }

  public requirementsToString(): string {
    return this.boatService.requirementsToString(this.boat);
  }
}
