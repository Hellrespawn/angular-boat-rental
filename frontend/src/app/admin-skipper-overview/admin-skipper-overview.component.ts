import { Component, OnInit } from '@angular/core';
import { addToNavBar } from '../navigation.service';
import { SkipperService } from '../skipper.service';
import { SnackBarInput, SnackBarService } from '../snack-bar.service';

@addToNavBar({
  name: 'Skipper-administratie',
  route: '/skipper-overview-admin',
  userTypes: ['admin'],
})
@Component({
  selector: 'app-admin-skipper-overview',
  templateUrl: './admin-skipper-overview.component.html',
  styleUrls: ['./admin-skipper-overview.component.scss'],
})
export class AdminSkipperOverviewComponent implements OnInit {
  // array of all the skippers, gets rendered in html with an *ngFor loop
  public arrayOfSkippers: SkipperForAdmin[] = [];
  // input for the snackbar on succesvol deletion of a boat
  private readonly succesSnackbarInput: SnackBarInput = {
    message: 'Schipper is verwijderd!',
    buttonText: 'Sluit',
    duration: 2000,
    error: false,
  };
  constructor(
    private skipperService: SkipperService,
    private snackBarService: SnackBarService
  ) {}

  ngOnInit(): void {
    this.getSkippersFromDatabase();
  }
  /**
   * sends a request to the backend via the service to fetch all skippers, then stores them in this.arrayOfSkippers
   */
  private async getSkippersFromDatabase(): Promise<void> {
    this.skipperService.getSkippers().subscribe((skippers) => {
      this.arrayOfSkippers = skippers.skippers;
    });
  }
  /**
   * sends a request to the backend via the service to delete a skipper with a certain id, and if succesful deletes the deleted skipper from the frontend
   * @param id id of skipper to be deleted
   * @param index index of skipper to be deleted (to delete from frontend)
   */
  public async deleteSkipperById(id: number, index: number): Promise<void> {
    this.skipperService.deleteSkipperById(id).subscribe(() => {
      this.arrayOfSkippers.splice(index, 1);
      this.snackBarService.makeSnackbarThatClosesAutomatically(
        this.succesSnackbarInput
      );
    });
  }
  /**
   * sends a request to the backend via the service to update the leave boolean of a skipper with a certain id, and if succesful updates the updated skipper in the frontend
   * @param id id of skipper to update
   * @param updatedValue updated value of the leave boolean
   * @param index index of skipper to be updated (in frontend)
   */
  public async updateLeave(
    id: number,
    updatedValue: boolean,
    index: number
  ): Promise<void> {
    this.skipperService.updateLeaveStatus(id, updatedValue).subscribe(() => {
      this.arrayOfSkippers[index].leave = updatedValue;
    });
  }
  /**
   * parses a date string to an instance of the Date class, needed because of a bug
   * @param dateString the string containing the date
   * @returns an instance of the Date class
   */
  public parseDateStringToDate(dateString: string | Date): Date {
    return new Date(dateString);
  }
}

interface SkipperForAdmin {
  id: number;
  name: string;
  pricePerDay: number;
  birthDate: Date | string;
  leave: boolean;
}
