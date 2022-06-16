import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Skipper } from './skipper';

@Injectable({
  providedIn: 'root',
})
export class SkipperService {
  constructor(private httpClient: HttpClient) {}

  /**
   * sends a new skipper object to the backend, in which it will be stored in the database
   * @param skipperObject object describing the new skipper
   * @returns an observable of either the created skipper or an error object
   */
  public addSkipper(skipperObject: {}): Observable<void> {
    return this.httpClient.post<void>(`/api/skippers`, skipperObject);
  }

  /**
   * requests all skippers from the backend
   * @returns an observable of an array of skippers (can be empty)
   */
  public getSkippers(): Observable<Skipper[]> {
    return this.httpClient.get<Skipper[]>(`/api/skippers`);
  }
  /**
   * sends a request for deletion of a specific skipper to the backend
   * @param id id of the skipper which needs to be deleted
   * @returns an Observable of the return object of the deletion
   */
  public deleteSkipperById(id: number): Observable<void> {
    return this.httpClient.delete<void>(`/api/skippers/${id}`);
  }
  /**
   * updates the leave boolean to the updated value of a specific skipper found by id
   * @param id id of specific skipper
   * @param updatedValue updated value of the leave boolean
   * @returns an Observable of the response object
   */
  public updateLeaveStatus(
    id: number,
    updatedValue: boolean
  ): Observable<void> {
    return this.httpClient.patch<void>(`/api/skippers`, {
      id,
      updatedValue,
    });
  }
}
