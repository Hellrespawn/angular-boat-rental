import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UserService } from '../user.service';
import { addToNavBar } from '../navigation.service';
import { SnackBarInput, SnackBarService } from '../snack-bar.service';
import { FineDialogComponent } from './fine-dialog/fine-dialog.component';
import { Fine } from '../fine';
import { FineService } from '../fine.service';

@addToNavBar({
  name: 'Account-administratie',
  route: '/user-overview-admin',
  userTypes: ['admin'],
})
@Component({
  selector: 'app-admin-user-overview',
  templateUrl: './admin-user-overview.component.html',
  styleUrls: ['./admin-user-overview.component.scss'],
})
export class AdminUserOverviewComponent implements OnInit {
  // array of all the users, gets rendered in html with an *ngFor loop
  public arrayOfUsers: UserForAdmin[] = [];
  // input for the snackbar on succesvol deletion of a boat
  private readonly succesSnackbarInput: SnackBarInput = {
    message: 'Klant is verwijderd!',
    buttonText: 'Sluit',
    duration: 2000,
    error: false,
  };

  // input for snackbar on succesful fine
  private readonly succesSnackbarInputFine: SnackBarInput = {
    message: 'Boete uitgedeeld!',
    buttonText: 'Sluit',
    duration: 2000,
    error: false,
  };

  // input for snackbar on succesful fine
  private readonly errorSnackbarInputFine: SnackBarInput = {
    message: 'Voer een geldige waarde in!',
    buttonText: 'Sluit',
    duration: 2000,
    error: true,
  };

  constructor(
    private userService: UserService,
    private snackBarService: SnackBarService,
    private dialog: MatDialog,
    private fineService: FineService
  ) {}

  ngOnInit(): void {
    this.getUsersFromDatabase();
  }

  /**
   * opens a dialog to get the input for a new fine
   * @param idOfCustomer id of the specific customer
   * @param firstNameOfCustomer firstname of customer to be shown in the modal
   * @param lastNameOfCustomer lastname of customer to be shown in the modal
   */
  public openDialog(
    idOfCustomer: number,
    firstNameOfCustomer: string,
    lastNameOfCustomer: string
  ): void {
    const dialogRef = this.dialog.open(FineDialogComponent, {
      width: '400px',
      data: {
        idOfCustomer,
        firstNameOfCustomer,
        lastNameOfCustomer,
      },
      panelClass: 'fine-modalbox',
    });

    dialogRef.afterClosed().subscribe((result) => {
      result = result ? parseInt(result) : undefined;
      if (result && result > 0) {
        this.sendNewFineToBackend(idOfCustomer, result);
      } else if (result <= 0 || typeof result != 'number') {
        this.snackBarService.makeSnackbarThatClosesAutomatically(
          this.errorSnackbarInputFine
        );
      }
    });
  }

  /**
   * sends a request to the backend via the service to add a new fine to the database
   * @param userID id of user
   * @param amount fine-amount
   */
  public async sendNewFineToBackend(
    userId: number,
    amount: number
  ): Promise<void> {
    this.fineService.addFine({ userId, amount, paid: false }).subscribe(() => {
      for (let user of this.arrayOfUsers) {
        if (user.id === userId)
          user.arrayOfFines.push({ userId, amount, paid: false });
      }
      this.snackBarService.makeSnackbarThatClosesAutomatically(
        this.succesSnackbarInputFine
      );
    });
  }

  /**
   * sends a request to the backend via the service to fetch all users, then stores them in this.arrayOfusers
   */
  private async getUsersFromDatabase(): Promise<void> {
    this.userService.getUsers().subscribe((users) => {
      this.arrayOfUsers = users;
    });
  }
  /**
   * sends a request to the backend via the service to delete a user with a certain id, and if succesful deletes the deleted user from the frontend
   * @param id id of user to be deleted
   * @param index index of user to be deleted (to delete from frontend)
   */
  public async deleteUserById(id: number, index: number): Promise<void> {
    this.userService.deleteUserById(id).subscribe(() => {
      this.arrayOfUsers.splice(index, 1);
      this.snackBarService.makeSnackbarThatClosesAutomatically(
        this.succesSnackbarInput
      );
    });
  }
  /**
   * sends a request to the backend via the service to update the blocked boolean of a user with a certain id, and if succesful updates the updated user in the frontend
   * @param id id of user to update
   * @param updatedValue updated value of the blocked boolean
   * @param index index of user to be updated (in frontend)
   */
  public async updateBlocked(
    id: number,
    updatedValue: boolean,
    index: number
  ): Promise<void> {
    this.userService.updateBlockedStatus(id, updatedValue).subscribe(() => {
      this.arrayOfUsers[index].blocked = updatedValue;
    });
  }
}

interface UserForAdmin {
  id: number;
  firstName: string;
  lastName: string;
  licence: boolean;
  dateOfBirth: Date;
  emailAddress: string;
  password: string;
  blocked: boolean;
  arrayOfFines: Fine[];
}
