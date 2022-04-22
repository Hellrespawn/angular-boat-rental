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

  public getCustomers(): Observable<any> {
    return this.httpClient.get<{ customers: Customer[] }>(
      `${environment.backendUrl}/customer`
    );
  }
  public deleteCustomerById(id: number): Observable<Object> {
    return this.httpClient.delete(
      `${environment.backendUrl}/delete-customer/${id}`
    );
  }
  public updateBlockedStatus(
    id: number,
    updatedValue: boolean
  ): Observable<Object> {
    return this.httpClient.patch(`${environment.backendUrl}/update-customer`, {
      id,
      updatedValue,
    });
  }
}
