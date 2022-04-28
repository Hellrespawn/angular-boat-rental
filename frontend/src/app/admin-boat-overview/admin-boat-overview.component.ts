import { Component, OnInit } from '@angular/core';
import { BoatService } from '../boat.service';
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
  // array of all the boats, gets rendered in html with an *ngFor loop
  public arrayOfBoats: BoatForAdmin[] = [];
  // input for the snackbar on succesvol deletion of a boat
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

  /**
   * gets called when te component if fully loaded
   */
  ngOnInit(): void {
    this.getBoatsFromDatabase();
  }
  /**
   * sends a request to the backend via the service to fetch all boats, then stores them in this.arrayOfBoats
   */
  private async getBoatsFromDatabase(): Promise<void> {
    this.boatService.getBoats().subscribe(({ boats }) => {
      this.arrayOfBoats = boats;
    });
  }
  /**
   * sends a request to the backend via the service to delete a boat with a certain id, and if succesful deletes the deleted boat from the frontend
   * @param id id of boat to be deleted
   * @param index index of boat to be deleted (to delete from frontend)
   */
  public async deleteBoatById(id: number, index: number): Promise<void> {
    this.boatService.deleteBoatById(id).subscribe(() => {
      this.arrayOfBoats.splice(index, 1);
      this.snackBarService.makeSnackbarThatClosesAutomatically(
        this.succesSnackbarInput
      );
    });
  }
  /**
   * sends a request to the backend via the service to update the maintenance boolean of a boat with a certain id, and if succesful updates the updated boat in the frontend
   * @param id id of boat to update
   * @param updatedValue updated value of the maintenance boolean
   * @param index index of boat to be updated (in frontend)
   */
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
