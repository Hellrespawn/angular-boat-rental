import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Customer } from './customer';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  constructor(private httpClient: HttpClient) {}

  /**
   * sends a request to the backend for all skippers in the database
   * @returns an Observable of an array of Customers
   */
  public getCustomers(): Observable<any> {
    return this.httpClient.get<{ customers: Customer[] }>(
      `${environment.backendUrl}/customers`
    );
  }
  /**
   * sends a request to the backend to delete a specific Customer by id
   * @param id id of the specific Cutsomer
   * @returns an Observable of the response object
   */
  public deleteCustomerById(id: number): Observable<Object> {
    return this.httpClient.delete(`${environment.backendUrl}/customers/${id}`);
  }
  /**
   * sends a request to the backend to update the blocked boolean of a specific Customer by id
   * @param id the id of the customer needed to be updated
   * @param updatedValue the new value of the blocked boolean of specific customer
   * @returns an Observable of the response object
   */
  public updateBlockedStatus(
    id: number,
    updatedValue: boolean
  ): Observable<Object> {
    return this.httpClient.patch(`${environment.backendUrl}/customers`, {
      id,
      updatedValue,
    });
  }
}
