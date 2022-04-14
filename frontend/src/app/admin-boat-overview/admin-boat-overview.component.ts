import { Component, OnInit } from '@angular/core';
import { BoatService } from '../boat-service.service';
import { addToNavBar } from '../navigation.service';
import { SnackBarInput, SnackBarService } from '../snack-bar.service';

@addToNavBar({
  name: 'Boot-administratie',
  route: '/boat-overview-admin',
  userTypes: ['admin'],
})
@Component({
  selector: 'app-admin-boat-overview',
  templateUrl: './admin-boat-overview.component.html',
  styleUrls: ['./admin-boat-overview.component.scss'],
})
export class AdminBoatOverviewComponent implements OnInit {
  public arrayOfBoats: Array<BoatForAdmin> = [];
  private readonly succesSnackbarInput: SnackBarInput = {
    message: 'Boot is verwijderd!',
    buttonText: 'Sluit',
    duration: 2000,
    error: false,
  };
  constructor(
    private boatService: BoatService,
    private snackBarService: SnackBarService
  ) {}

  ngOnInit(): void {
    this.getBoatsFromDatabase();
  }
  private async getBoatsFromDatabase(): Promise<void> {
    this.boatService.getBoats().subscribe(({ boats }) => {
      this.arrayOfBoats = boats;
    });
  }
  public async deleteBoatById(id: number, index: number): Promise<void> {
    this.boatService.deleteBoatById(id).subscribe(() => {
      this.arrayOfBoats.splice(index, 1);
      this.snackBarService.makeSnackbarThatClosesAutomatically(
        this.succesSnackbarInput
      );
    });
  }
  public async updateMaintenance(
    id: number,
    updatedValue: boolean,
    index: number
  ): Promise<void> {
    this.boatService.updateMaintenanceStatus(id, updatedValue).subscribe(() => {
      this.arrayOfBoats[index].maintenance = updatedValue;
    });
  }
}

interface BoatForAdmin {
  id: number;
  name: string;
  registrationNumber: number;
  pricePerDay: number;
  maintenance: boolean;
}
