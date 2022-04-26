import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Boat } from './boat';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class BoatService {
  constructor(private httpClient: HttpClient) {}

  /**
   * sends a request to the backend to add a new boat to the database
   * @param boatObject the object specifying the new boat
   * @returns and Observable of either the newly added boat or an error object
   */
  public addBoat(boatObject: {}): Observable<Boat> {
    return this.httpClient.post<Boat>(
      `${environment.backendUrl}/boats`,
      boatObject
    );
  }

  /**
   * sends a request to the backend to fetch all Boats from the database
   * @returns an Observable of an array of all Boats in the database
   */
  public getBoats(): Observable<{ boats: Boat[] }> {
    return this.httpClient.get<{ boats: Boat[] }>(
      `${environment.backendUrl}/boats`
    );
  }

  /**
   * sends a request to the backend to delete a specific boat
   * @param id the id of the boat that needs to be deleted
   * @returns an Observable of the response object
   */
  public deleteBoatById(id: number): Observable<void> {
    return this.httpClient.delete<void>(
      `${environment.backendUrl}/boats/${id}`
    );
  }
  /**
   * sends a request to the backend to update the maintenance boolean value of a specific boat
   * @param id the id of the specific boat
   * @param updatedValue the new value of the maintenance boolean of the specific boat
   * @returns an Observable of the response object
   */
  public updateMaintenanceStatus(
    id: number,
    updatedValue: boolean
  ): Observable<void> {
    return this.httpClient.patch<void>(`${environment.backendUrl}/boats`, {
      id,
      updatedValue,
    });
  }
}
