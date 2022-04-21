import { Component, OnInit } from '@angular/core';
import { CustomerService } from '../customer.service';
import { SnackBarInput, SnackBarService } from '../snack-bar.service';

@Component({
  selector: 'app-admin-customer-overview',
  templateUrl: './admin-customer-overview.component.html',
  styleUrls: ['./admin-customer-overview.component.scss'],
})
export class AdminCustomerOverviewComponent implements OnInit {
  public arrayOfCustomers: Array<CustomerForAdmin> = [];
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
  private async getCustomersFromDatabase(): Promise<void> {
    this.customerService.getCustomers().subscribe((customers) => {
      this.arrayOfCustomers = customers;
    });
  }
  public async deleteCustomerById(id: number, index: number): Promise<void> {
    this.customerService.deleteCustomerById(id).subscribe(() => {
      this.arrayOfCustomers.splice(index, 1);
      this.snackBarService.makeSnackbarThatClosesAutomatically(
        this.succesSnackbarInput
      );
    });
  }
  public async updateBlocked(
    id: number,
    updatedValue: boolean,
    index: number
  ): Promise<void> {
    this.customerService.updateBlockedStatus(id, updatedValue).subscribe(() => {
      this.arrayOfCustomers[index].blocked = updatedValue;
    });
  }
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
