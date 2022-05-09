import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { addToNavBar } from '../navigation.service';
import { SnackBarInput, SnackBarService } from '../snack-bar.service';

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
  constructor(
    private userService: UserService,
    private snackBarService: SnackBarService
  ) {}

  ngOnInit(): void {
    this.getUsersFromDatabase();
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
  /**
   * parses a date string to an instance of the Date class, needed because of a bug
   * @param dateString the string containing the date
   * @returns an instance of the Date class
   */
  public parseDateStringToDate(dateString: string | Date): Date {
    return new Date(dateString);
  }
}

interface UserForAdmin {
  id: number;
  firstName: string;
  lastName: string;
  licence: boolean;
  dateOfBirth: Date | string;
  emailAddress: string;
  password: string;
  blocked: boolean;
}
