import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { BoatOverviewData } from './rental/rental.component';
import { Boat, BoatRequirements } from './boat';
import { environment } from 'src/environments/environment';
import { BoatDetailData } from './rental/boat-card/boat-details/boat-details.component';

@Injectable({
  providedIn: 'root',
})
export class BoatService {
  constructor(private httpClient: HttpClient) {}

  public addBoat(boatObject: {}) {
    return this.httpClient.post(`${environment.backendUrl}/boats`, boatObject);
  }

  public getBoats(): Observable<any> {
    return this.httpClient.get<{ boats: Boat[] }>(
      `${environment.backendUrl}/boats`
    );
  }

  public deleteBoatById(id: number): Observable<Object> {
    return this.httpClient.delete(`${environment.backendUrl}/boats/${id}`);
  }
  public updateMaintenanceStatus(
    id: number,
    updatedValue: boolean
  ): Observable<Object> {
    return this.httpClient.patch(`${environment.backendUrl}/boats`, {
      id,
      updatedValue,
    });
  }
}
