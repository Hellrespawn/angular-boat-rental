import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Fine } from './fine';

@Injectable({
  providedIn: 'root',
})
export class FineService {
  constructor(private httpClient: HttpClient) {}

  /**
   * sends a request to the backend for all fines in the database
   * @returns an Observable of an array of Fines
   */
  public getFines(): Observable<Fine[]> {
    return this.httpClient.get<Fine[]>(`${environment.backendUrl}/fines`);
  }

  /**
   * sends a request to the backend to add a new fine to the database
   * @param fineObject the object specifying the new fine
   * @returns and Observable of either the newly added fine or an error object
   */
  public addFine(fineObject: {}): Observable<Fine> {
    return this.httpClient.post<Fine>(
      `${environment.backendUrl}/fines`,
      fineObject
    );
  }
}
