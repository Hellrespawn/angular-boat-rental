import { Component, OnInit } from '@angular/core';
import { CustomerService } from '../customer.service';
import { addToNavBar } from '../navigation.service';
import { SnackBarInput, SnackBarService } from '../snack-bar.service';

@addToNavBar({
  name: 'Account-administratie',
  route: '/customer-overview-admin',
  userTypes: ['admin'],
})
@Component({
  selector: 'app-admin-customer-overview',
  templateUrl: './admin-customer-overview.component.html',
  styleUrls: ['./admin-customer-overview.component.scss'],
})
export class AdminCustomerOverviewComponent implements OnInit {
  // array of all the customers, gets rendered in html with an *ngFor loop
  public arrayOfCustomers: CustomerForAdmin[] = [];
  // input for the snackbar on succesvol deletion of a boat
  private readonly succesSnackbarInput: SnackBarInput = {
    message: 'Klant is verwijderd!',
    buttonText: 'Sluit',
    duration: 2000,
    error: false,
  };
  constructor(
    private customerService: CustomerService,
    private snackBarService: SnackBarService
  ) {}

  ngOnInit(): void {
    this.getCustomersFromDatabase();
  }
  /**
   * sends a request to the backend via the service to fetch all customers, then stores them in this.arrayOfCustomers
   */
  private async getCustomersFromDatabase(): Promise<void> {
    this.customerService.getCustomers().subscribe((customers) => {
      this.arrayOfCustomers = customers;
    });
  }
  /**
   * sends a request to the backend via the service to delete a customer with a certain id, and if succesful deletes the deleted customer from the frontend
   * @param id id of customer to be deleted
   * @param index index of customer to be deleted (to delete from frontend)
   */
  public async deleteCustomerById(id: number, index: number): Promise<void> {
    this.customerService.deleteCustomerById(id).subscribe(() => {
      this.arrayOfCustomers.splice(index, 1);
      this.snackBarService.makeSnackbarThatClosesAutomatically(
        this.succesSnackbarInput
      );
    });
  }
  /**
   * sends a request to the backend via the service to update the blocked boolean of a customer with a certain id, and if succesful updates the updated customer in the frontend
   * @param id id of customer to update
   * @param updatedValue updated value of the blocked boolean
   * @param index index of customer to be updated (in frontend)
   */
  public async updateBlocked(
    id: number,
    updatedValue: boolean,
    index: number
  ): Promise<void> {
    this.customerService.updateBlockedStatus(id, updatedValue).subscribe(() => {
      this.arrayOfCustomers[index].blocked = updatedValue;
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

interface CustomerForAdmin {
  id: number;
  firstName: string;
  lastName: string;
  licence: boolean;
  dateOfBirth: Date | string;
  emailAddress: string;
  password: string;
  blocked: boolean;
}